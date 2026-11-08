const assert = require('node:assert');
const { getCookieValue, normalizeCookieHeader } = require('../build/lib/authCookies');

describe('getCookieValue', () => {
    it('reads the requested cookie among other cookies', () => {
        assert.strictEqual(getCookieValue('other=value; web.0.access_token=token', 'web.0.access_token'), 'token');
    });

    it('preserves equals signs in the cookie value', () => {
        assert.strictEqual(getCookieValue('web.0.access_token=token==', 'web.0.access_token'), 'token==');
    });

    it('decodes an encoded session cookie value', () => {
        assert.strictEqual(getCookieValue('web.0.sid=s%3Aabc%2Fdef', 'web.0.sid'), 's:abc/def');
    });

    it('returns malformed percent escapes unchanged', () => {
        assert.strictEqual(getCookieValue('web.0.sid=s%3Aabc%', 'web.0.sid'), 's%3Aabc%');
    });

    it('returns undefined when the requested cookie is absent', () => {
        assert.strictEqual(getCookieValue('access_token=token', 'web.0.access_token'), undefined);
    });

    it('prefers the new cookie when both new and legacy names are present', () => {
        assert.strictEqual(
            getCookieValue('connect.sid=old; web.0.sid=new', ['web.0.sid', 'connect.sid']),
            'new',
        );
    });

    it('uses the legacy cookie when the new name is absent', () => {
        assert.strictEqual(getCookieValue('connect.sid=old', ['web.0.sid', 'connect.sid']), 'old');
    });

    it('maps a legacy session cookie to the new name without changing its value', () => {
        const normalized = normalizeCookieHeader('connect.sid=s%3Aabc%2Fdef==', 'web.0.sid', ['connect.sid']);
        assert.strictEqual(normalized, 'connect.sid=s%3Aabc%2Fdef==; web.0.sid=s%3Aabc%2Fdef==');
    });

    it('does not replace the new cookie with a legacy one', () => {
        assert.strictEqual(
            normalizeCookieHeader('connect.sid=old; web.0.sid=new', 'web.0.sid', ['connect.sid']),
            'connect.sid=old; web.0.sid=new',
        );
    });
});