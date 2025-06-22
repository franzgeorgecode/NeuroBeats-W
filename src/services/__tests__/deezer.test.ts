import DeezerService from '../deezer'; // Adjust path as necessary
import { QueryClient } from '@tanstack/react-query';

// Mock the makeRequest method directly on the prototype or instance
jest.mock('../deezer', () => {
  const originalModule = jest.requireActual('../deezer');
  return {
    __esModule: true,
    ...originalModule,
    // Mock the default export (DeezerService class)
    default: jest.fn().mockImplementation((queryClient) => {
      // Instantiate the actual service to get its structure
      const serviceInstance = new originalModule.default(queryClient);
      // Mock the makeRequest method on this instance
      serviceInstance.makeRequest = jest.fn();
      return serviceInstance;
    }),
  };
});


describe('DeezerService', () => {
  let service: DeezerService;
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = new QueryClient();
    // service will be an instance of the mocked DeezerService,
    // which has makeRequest as a jest.fn()
    service = new (DeezerService as any)(mockQueryClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getArtistDetails', () => {
    it('should call makeRequest with the correct endpoint for getArtistDetails', async () => {
      const artistId = '123';
      // The methods in DeezerService use queryClient.fetchQuery,
      // which then calls the passed queryFn.
      // The queryFn is `() => this.makeRequest<DeezerArtist>(...)`.
      // So, when getArtistDetails is called, fetchQuery should execute this.makeRequest.

      // To test this, we need to make sure that makeRequest (which is mocked) is called.
      // The mock setup replaces the DeezerService class, and instances of this class
      // will have makeRequest as a jest.fn().

      // We assume the actual makeRequest call happens inside fetchQuery's queryFn.
      // The test will call the service method, and then check if the spied
      // makeRequest was called with correct parameters.

      // Simulating the call to fetchQuery's queryFn for testing the mock directly:
      // This is a bit of a workaround because of fetchQuery abstraction.
      // A more thorough test would involve mocking fetchQuery itself.
      // However, the current mock structure directly targets makeRequest.
      // So, we call the method, and it should use the mocked makeRequest.
      await service.getArtistDetails(artistId);

      expect(service.makeRequest).toHaveBeenCalledWith(`/artist/${artistId}`);
    });
  });

  describe('getArtistTopTracks', () => {
    it('should call makeRequest with correct endpoint and params for getArtistTopTracks', async () => {
      const artistId = '456';
      const limit = 5;
      await service.getArtistTopTracks(artistId, limit);
      expect(service.makeRequest).toHaveBeenCalledWith(`/artist/${artistId}/top`, { limit: limit.toString() });
    });
  });

  describe('getArtistAlbums', () => {
    it('should call makeRequest with correct endpoint and params for getArtistAlbums', async () => {
      const artistId = '789';
      const limit = 15;
      await service.getArtistAlbums(artistId, limit);
      expect(service.makeRequest).toHaveBeenCalledWith(`/artist/${artistId}/albums`, { limit: limit.toString() });
    });
  });

  describe('getAlbumTracks', () => {
    it('should call makeRequest with correct endpoint and params for getAlbumTracks', async () => {
      const albumId = '101';
      const limit = 20;
      await service.getAlbumTracks(albumId, limit);
      expect(service.makeRequest).toHaveBeenCalledWith(`/album/${albumId}/tracks`, { limit: limit.toString() });
    });
  });

  describe('getArtistsByGenre', () => {
    it('should call makeRequest with correct endpoint and params for getArtistsByGenre', async () => {
      const genreId = '111';
      const limit = 7;
      await service.getArtistsByGenre(genreId, limit);
      expect(service.makeRequest).toHaveBeenCalledWith(`/genre/${genreId}/artists`, { limit: limit.toString() });
    });
  });

  describe('getTopTracksByGenre', () => {
    it('should call makeRequest with correct endpoint and params for getTopTracksByGenre', async () => {
      const genreId = '222';
      const limit = 12;
      await service.getTopTracksByGenre(genreId, limit);
      expect(service.makeRequest).toHaveBeenCalledWith(`/genre/${genreId}/tracks`, { limit: limit.toString() });
    });
  });

  describe('getRadioForGenre', () => {
    it('should call makeRequest with correct endpoint and params for getRadioForGenre', async () => {
      const genreId = '333';
      const limit = 22;
      await service.getRadioForGenre(genreId, limit);
      expect(service.makeRequest).toHaveBeenCalledWith(`/genre/${genreId}/radio`, { limit: limit.toString() });
    });
  });

  describe('getRadioForArtist', () => {
    it('should call makeRequest with correct endpoint and params for getRadioForArtist', async () => {
      const artistId = '444';
      const limit = 18;
      await service.getRadioForArtist(artistId, limit);
      expect(service.makeRequest).toHaveBeenCalledWith(`/artist/${artistId}/radio`, { limit: limit.toString() });
    });
  });

  // Test for an existing method to ensure the setup is okay.
  describe('searchSongs', () => {
    it('should call makeRequest with correct endpoint and params for searchSongs', async () => {
        const query = 'test query';
        const limit = 5;
        await service.searchSongs(query, limit);
        expect(service.makeRequest).toHaveBeenCalledWith('/search', { q: query, limit: limit.toString() });
    });
  });

});
