<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ApiCompatibilityTest extends TestCase
{
    use RefreshDatabase;

    private const EMAIL = 'admin@test.local';

    private const PASSWORD = 'Secret123!456';

    private const CSRF = 'test-csrf-token';

    private int $adminId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminId = (int) DB::table('admin_users')->insertGetId([
            'email' => self::EMAIL,
            'password_hash' => password_hash(self::PASSWORD, PASSWORD_DEFAULT),
        ]);
    }

    private function asAdmin(): static
    {
        return $this->withSession([
            'admin_id' => $this->adminId,
            'admin_email' => self::EMAIL,
            'csrf_token' => self::CSRF,
        ]);
    }

    private function withCsrf(): static
    {
        return $this->withHeader('X-CSRF-Token', self::CSRF);
    }

    public function test_public_endpoints_and_error_shapes(): void
    {
        $this->getJson('/api/gammes/list.php')
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->getJson('/api/does-not-exist.php')
            ->assertStatus(404)
            ->assertExactJson(['success' => false, 'error' => 'not_found']);

        $this->postJson('/api/gammes/list.php')
            ->assertStatus(405)
            ->assertExactJson(['success' => false, 'error' => 'method_not_allowed']);
    }

    public function test_login_validation_and_session_payload(): void
    {
        $this->call('POST', '/api/auth/login.php', [], [], [], ['CONTENT_TYPE' => 'application/json'], '{bad json')
            ->assertStatus(400)
            ->assertExactJson(['success' => false, 'error' => 'invalid_json_body']);

        $this->postJson('/api/auth/login.php', ['email' => self::EMAIL, 'password' => 'wrong-password'])
            ->assertStatus(401)
            ->assertExactJson(['success' => false, 'error' => 'invalid_credentials']);

        $response = $this->postJson('/api/auth/login.php', [
            'email' => self::EMAIL,
            'password' => self::PASSWORD,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.email', self::EMAIL)
            ->assertJsonStructure(['data' => ['email', 'csrfToken']]);

        $response->assertSessionHas('admin_id', $this->adminId);
        $this->assertNotEmpty($response->json('data.csrfToken'));
    }

    public function test_protected_routes_require_authentication(): void
    {
        $this->getJson('/api/admins/list.php')
            ->assertStatus(401)
            ->assertExactJson(['success' => false, 'error' => 'unauthorized']);

        $this->getJson('/api/content/drafts.php')
            ->assertStatus(401)
            ->assertExactJson(['success' => false, 'error' => 'unauthorized']);
    }

    public function test_csrf_token_is_enforced_on_writes(): void
    {
        $this->asAdmin()
            ->postJson('/api/gammes/create.php', ['nom' => ['fr' => 'Sans jeton', 'en' => 'No token']])
            ->assertStatus(403)
            ->assertExactJson(['success' => false, 'error' => 'invalid_csrf_token']);

        $this->asAdmin()
            ->withCsrf()
            ->postJson('/api/gammes/create.php', ['nom' => ['fr' => 'Avec jeton', 'en' => 'With token']])
            ->assertStatus(201)
            ->assertJsonPath('data.id', 'avec-jeton');
    }

    public function test_gamme_crud_and_void_success_payload(): void
    {
        $first = $this->asAdmin()->withCsrf()
            ->postJson('/api/gammes/create.php', [
                'nom' => ['fr' => 'Premiere gamme', 'en' => 'First range'],
                'color' => '#112233',
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.color', '#C9971A')
            ->json('data');

        $second = $this->asAdmin()->withCsrf()
            ->postJson('/api/gammes/create.php', ['nom' => ['fr' => 'Deuxieme gamme', 'en' => 'Second range']])
            ->assertStatus(201)
            ->json('data');

        $this->asAdmin()->withCsrf()
            ->postJson('/api/gammes/update.php', ['id' => $first['id'], 'color' => '#445566'])
            ->assertOk()
            ->assertJsonPath('data.color', '#445566');

        $this->asAdmin()->withCsrf()
            ->postJson('/api/gammes/reorder.php', ['order' => [$second['id'], $first['id']]])
            ->assertOk()
            ->assertJsonPath('data.0.id', $second['id']);

        $this->asAdmin()->withCsrf()
            ->postJson('/api/gammes/delete.php', ['id' => 'missing-gamme'])
            ->assertStatus(404)
            ->assertExactJson(['success' => false, 'error' => 'not_found']);

        $this->asAdmin()->withCsrf()
            ->postJson('/api/gammes/delete.php', ['id' => $first['id']])
            ->assertOk()
            ->assertExactJson(['success' => true, 'data' => null]);
    }

    public function test_admin_crud_and_self_delete_guard(): void
    {
        $this->asAdmin()->getJson('/api/admins/list.php')
            ->assertOk()
            ->assertJsonPath('data.0.isSelf', true);

        $created = $this->asAdmin()->withCsrf()
            ->postJson('/api/admins/create.php', [
                'email' => 'second@test.local',
                'password' => 'AnotherSecret123!',
            ])
            ->assertStatus(201)
            ->json('data');

        $this->asAdmin()->withCsrf()
            ->postJson('/api/admins/delete.php', ['id' => $created['id']])
            ->assertOk()
            ->assertExactJson(['success' => true, 'data' => null]);

        $this->asAdmin()->withCsrf()
            ->postJson('/api/admins/delete.php', ['id' => $this->adminId])
            ->assertStatus(409)
            ->assertExactJson(['success' => false, 'error' => 'cannot_delete_self']);
    }

    public function test_content_draft_publish_and_delete_flow(): void
    {
        $this->asAdmin()->withCsrf()
            ->postJson('/api/content/update.php', [
                'page' => 'accueil',
                'blockKey' => 'hero_title',
                'blockType' => 'text',
                'valueFr' => 'Titre publie',
                'valueEn' => 'Published title',
            ])
            ->assertOk()
            ->assertJsonPath('data.blockKey', 'hero_title');

        $this->asAdmin()->getJson('/api/content/drafts.php?page=accueil')
            ->assertOk()
            ->assertJsonPath('data.0.blockKey', 'hero_title');

        $this->asAdmin()->withCsrf()
            ->postJson('/api/content/publish.php', ['page' => 'accueil'])
            ->assertOk()
            ->assertJsonPath('data.published', 1);

        $this->getJson('/api/content/list.php?page=accueil&lang=fr')
            ->assertOk()
            ->assertJsonPath('data.0.blockKey', 'hero_title')
            ->assertJsonPath('data.0.value', 'Titre publie');

        $this->asAdmin()->withCsrf()
            ->postJson('/api/content/delete.php', ['page' => 'accueil', 'blockKey' => 'hero_title'])
            ->assertOk()
            ->assertExactJson(['success' => true, 'data' => null]);
    }

    public function test_contact_submit_list_manage_and_delete(): void
    {
        $id = $this->postJson('/api/contact/submit.php', [
            'name' => 'Client Test',
            'email' => 'client@test.local',
            'phone' => '+237600000000',
            'message' => 'Bonjour, ceci est un test.',
        ])
            ->assertStatus(201)
            ->json('data.id');

        $this->asAdmin()->getJson('/api/contact/list.php')
            ->assertOk()
            ->assertJsonPath('data.total', 1)
            ->assertJsonPath('data.unread', 1)
            ->assertJsonPath('data.items.0.id', $id);

        $this->asAdmin()->withCsrf()
            ->postJson('/api/contact/manage.php', ['id' => $id, 'isRead' => true])
            ->assertOk()
            ->assertJsonPath('data.isRead', true);

        $this->asAdmin()->withCsrf()
            ->postJson('/api/contact/manage.php', ['id' => $id, 'delete' => true])
            ->assertOk()
            ->assertExactJson(['success' => true, 'data' => null]);

        $this->assertSame(0, DB::table('contact_messages')->count());
    }

    public function test_settings_update_validation_and_restore(): void
    {
        $this->asAdmin()->withCsrf()
            ->postJson('/api/settings/update.php', ['key' => 'phone', 'value' => '+237600000000'])
            ->assertOk()
            ->assertJsonPath('data.phone', '+237600000000');

        $this->asAdmin()->withCsrf()
            ->postJson('/api/settings/update.php', ['unknown_key' => 'value'])
            ->assertStatus(422)
            ->assertExactJson(['success' => false, 'error' => 'invalid_setting_key']);

        $this->asAdmin()->withCsrf()
            ->postJson('/api/settings/update.php', ['key' => 'email', 'value' => 'not-an-email'])
            ->assertStatus(422)
            ->assertExactJson(['success' => false, 'error' => 'invalid_email']);
    }

    public function test_password_change_and_logout_flow(): void
    {
        $newPassword = 'NewSecret123!456';

        $this->asAdmin()->withCsrf()
            ->postJson('/api/auth/password.php', [
                'currentPassword' => self::PASSWORD,
                'newPassword' => $newPassword,
            ])
            ->assertOk()
            ->assertExactJson(['success' => true, 'data' => ['updated' => true]]);

        $hash = DB::table('admin_users')->where('id', $this->adminId)->value('password_hash');
        $this->assertTrue(password_verify($newPassword, $hash));

        $this->flushHeaders();

        $this->asAdmin()
            ->postJson('/api/auth/logout.php')
            ->assertStatus(403)
            ->assertExactJson(['success' => false, 'error' => 'invalid_csrf_token']);

        $this->asAdmin()->withCsrf()
            ->postJson('/api/auth/logout.php')
            ->assertOk()
            ->assertExactJson(['success' => true, 'data' => null]);
    }
}
