import { goToUrl } from '../routeUtil'; // replace './yourFile' with the actual file path

jest.mock('../commonUtils', () => ({
    encryptData: jest.fn(),
}));

jest.mock('../commonUtils', () => ({
    goToUrl: jest.fn(),
}));

describe('Route Utils', () => {
    beforeAll(() => {
        document.body.innerHTML = '';
    });

    it('should create a link and navigate to the URL', () => {
        const url = 'http://example.com/';
        goToUrl(url);

        const link = document.querySelector('a');
        if (link) {
            expect(link.href).toBe(url);
            expect(document.body.contains(link)).toBe(true);
        } else {
            fail('Link element not found');
        }
    });
});
