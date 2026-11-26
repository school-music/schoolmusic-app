
import { type Client, type ClientMeta, formDataBodySerializer, type Options as Options2, type RequestResult, type TDataShape } from './client';
import { client } from './client.gen';
import type { AddFallbackTrackData, AddFallbackTrackResponses, AddFavoriteData, AddFavoriteResponses, AdminTrackData, AdminTrackResponses, AdminTracksData, AdminTracksResponses, ApproveData, ApproveResponses, ArchiveData, ArchiveResponses, ArtistBlacklistData, ArtistBlacklistResponses, ArtistsRankingData, ArtistsRankingResponses, BanData, BanResponses, BansData, BansResponses, BlacklistArtistData, BlacklistArtistResponses, BlacklistSongData, BlacklistSongResponses, BreaksData, BreaksResponses, CalendarData, CalendarResponses, CreateEventData, CreateEventResponses, CreateExceptionBreakData, CreateExceptionBreakResponses, CreateExceptionDayData, CreateExceptionDayResponses, CreateTemplateData, CreateTemplateResponses, CreateTrackData, CreateTrackResponses, DashboardData, DashboardResponses, DeleteAccountData, DeleteAccountResponses, DeleteEventData, DeleteEventResponses, DeleteExceptionBreakData, DeleteExceptionBreakResponses, DeleteExceptionDayData, DeleteExceptionDayResponses, DeleteTemplateData, DeleteTemplateResponses, DeleteTrackData, DeleteTrackResponses, DenyData, DenyResponses, EventsData, EventsResponses, ExceptionBreaksData, ExceptionBreaksResponses, ExceptionDaysData, ExceptionDaysResponses, FallbackTracksData, FallbackTracksResponses, FavoritesData, FavoritesResponses, GreenlistData, GreenlistResponses, GreenlistSongData, GreenlistSongResponses, LiftBanData, LiftBanResponses, LoginData, LoginResponses, MutePlayerData, MutePlayerResponses, PausePlayerData, PausePlayerResponses, PendingData, PendingResponses, PlaybackHistoryData, PlaybackHistoryResponses, PlayerStatusData, PlayerStatusResponses, PlayFileData, PlayFileResponses, ProposeData, ProposeResponses, QueueForBreakData, QueueForBreakResponses, RegisterData, RegisterResponses, RemoveBlacklistedArtistData, RemoveBlacklistedArtistResponses, RemoveBlacklistedSongData, RemoveBlacklistedSongResponses, RemoveFallbackTrackData, RemoveFallbackTrackResponses, RemoveFavoriteData, RemoveFavoriteResponses, RemoveGreenlistedSongData, RemoveGreenlistedSongResponses, ReorderQueueData, ReorderQueueResponses, RestoreTrackData, RestoreTrackResponses, ResumePlayerData, ResumePlayerResponses, SetVolumeData, SetVolumeResponses, SkipTrackData, SkipTrackResponses, SongBlacklistData, SongBlacklistResponses, SongsRankingData, SongsRankingResponses, SpotifyConnectData, SpotifyConnectResponses, SpotifySearchData, SpotifySearchResponses, SpotifyStatusData, SpotifyStatusResponses, StopPlayerData, StopPlayerResponses, SystemStatusData, SystemStatusResponses, TemplatesData, TemplatesResponses, TrackData, TrackResponses, TracksData, TracksResponses, UndoVoteData, UndoVoteResponses, UpdateBaseBreaksData, UpdateBaseBreaksResponses, UpdateEventData, UpdateEventResponses, UpdateRoleData, UpdateRoleResponses, UpdateTemplateData, UpdateTemplateResponses, UpdateTrackData, UpdateTrackResponses, UpdateWeekdayData, UpdateWeekdayResponses, UpdateWeeklyBreakData, UpdateWeeklyBreakResponses, UploadAndPlayData, UploadAndPlayResponses, UsersData, UsersResponses, VoteData, VoteResponses, WeeklyBreaksData, WeeklyBreaksResponses, WeeklyData, WeeklyResponses } from './types.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean, TResponse = unknown> = Options2<TData, ThrowOnError, TResponse> & {
    client?: Client;
    meta?: keyof ClientMeta extends never ? Record<string, unknown> : ClientMeta;
};

export const login = <ThrowOnError extends boolean = false>(options: Options<LoginData, ThrowOnError>): RequestResult<LoginResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<LoginResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/auth/login',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const register = <ThrowOnError extends boolean = false>(options: Options<RegisterData, ThrowOnError>): RequestResult<RegisterResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<RegisterResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/auth/register',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const deleteAccount = <ThrowOnError extends boolean = false>(options?: Options<DeleteAccountData, ThrowOnError>): RequestResult<DeleteAccountResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).delete<DeleteAccountResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/auth/delete-acc',
    ...options
});

export const systemStatus = <ThrowOnError extends boolean = false>(options?: Options<SystemStatusData, ThrowOnError>): RequestResult<SystemStatusResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<SystemStatusResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/system/status',
    ...options
});

export const tracks = <ThrowOnError extends boolean = false>(options?: Options<TracksData, ThrowOnError>): RequestResult<TracksResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<TracksResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Tracks',
    ...options
});

export const spotifySearch = <ThrowOnError extends boolean = false>(options?: Options<SpotifySearchData, ThrowOnError>): RequestResult<SpotifySearchResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<SpotifySearchResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Tracks/search',
    ...options
});

export const track = <ThrowOnError extends boolean = false>(options: Options<TrackData, ThrowOnError>): RequestResult<TrackResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).get<TrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Tracks/{id}',
    ...options
});

export const favorites = <ThrowOnError extends boolean = false>(options?: Options<FavoritesData, ThrowOnError>): RequestResult<FavoritesResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<FavoritesResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Tracks/favourites',
    ...options
});

export const addFavorite = <ThrowOnError extends boolean = false>(options: Options<AddFavoriteData, ThrowOnError>): RequestResult<AddFavoriteResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<AddFavoriteResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Tracks/{id}/favourites',
    ...options
});

export const removeFavorite = <ThrowOnError extends boolean = false>(options: Options<RemoveFavoriteData, ThrowOnError>): RequestResult<RemoveFavoriteResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<RemoveFavoriteResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Tracks/favourites/{id}',
    ...options
});

export const queueForBreak = <ThrowOnError extends boolean = false>(options: Options<QueueForBreakData, ThrowOnError>): RequestResult<QueueForBreakResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).get<QueueForBreakResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Queue/break/{breakId}',
    ...options
});

export const propose = <ThrowOnError extends boolean = false>(options: Options<ProposeData, ThrowOnError>): RequestResult<ProposeResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<ProposeResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Queue/propose',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const vote = <ThrowOnError extends boolean = false>(options: Options<VoteData, ThrowOnError>): RequestResult<VoteResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<VoteResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Queue/vote',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const undoVote = <ThrowOnError extends boolean = false>(options: Options<UndoVoteData, ThrowOnError>): RequestResult<UndoVoteResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<UndoVoteResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Queue/vote/{queueItemId}',
    ...options
});

export const archive = <ThrowOnError extends boolean = false>(options: Options<ArchiveData, ThrowOnError>): RequestResult<ArchiveResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<ArchiveResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Queue/break/{breakId}/archive',
    ...options
});

export const reorderQueue = <ThrowOnError extends boolean = false>(options: Options<ReorderQueueData, ThrowOnError>): RequestResult<ReorderQueueResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).put<ReorderQueueResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Queue/break/{breakId}/order',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const breaks = <ThrowOnError extends boolean = false>(options?: Options<BreaksData, ThrowOnError>): RequestResult<BreaksResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<BreaksResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks',
    ...options
});

export const calendar = <ThrowOnError extends boolean = false>(options?: Options<CalendarData, ThrowOnError>): RequestResult<CalendarResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<CalendarResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/schedule/calendar',
    ...options
});

export const songsRanking = <ThrowOnError extends boolean = false>(options?: Options<SongsRankingData, ThrowOnError>): RequestResult<SongsRankingResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<SongsRankingResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Rankings/songs',
    ...options
});

export const artistsRanking = <ThrowOnError extends boolean = false>(options?: Options<ArtistsRankingData, ThrowOnError>): RequestResult<ArtistsRankingResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<ArtistsRankingResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Rankings/artists',
    ...options
});

export const playbackHistory = <ThrowOnError extends boolean = false>(options?: Options<PlaybackHistoryData, ThrowOnError>): RequestResult<PlaybackHistoryResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<PlaybackHistoryResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Rankings/history',
    ...options
});

export const pending = <ThrowOnError extends boolean = false>(options?: Options<PendingData, ThrowOnError>): RequestResult<PendingResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<PendingResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/pending',
    ...options
});

export const approve = <ThrowOnError extends boolean = false>(options: Options<ApproveData, ThrowOnError>): RequestResult<ApproveResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<ApproveResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/approve/{proposalId}',
    ...options
});

export const deny = <ThrowOnError extends boolean = false>(options: Options<DenyData, ThrowOnError>): RequestResult<DenyResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<DenyResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/deny/{proposalId}',
    ...options
});

export const bans = <ThrowOnError extends boolean = false>(options?: Options<BansData, ThrowOnError>): RequestResult<BansResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<BansResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/banned',
    ...options
});

export const ban = <ThrowOnError extends boolean = false>(options: Options<BanData, ThrowOnError>): RequestResult<BanResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<BanResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/ban/{userId}',
    ...options
});

export const liftBan = <ThrowOnError extends boolean = false>(options: Options<LiftBanData, ThrowOnError>): RequestResult<LiftBanResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<LiftBanResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/unaban/{banId}',
    ...options
});

export const songBlacklist = <ThrowOnError extends boolean = false>(options?: Options<SongBlacklistData, ThrowOnError>): RequestResult<SongBlacklistResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<SongBlacklistResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/blacklist',
    ...options
});

export const blacklistSong = <ThrowOnError extends boolean = false>(options: Options<BlacklistSongData, ThrowOnError>): RequestResult<BlacklistSongResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<BlacklistSongResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/blacklist',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const removeBlacklistedSong = <ThrowOnError extends boolean = false>(options: Options<RemoveBlacklistedSongData, ThrowOnError>): RequestResult<RemoveBlacklistedSongResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<RemoveBlacklistedSongResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/blacklist/{id}',
    ...options
});

export const artistBlacklist = <ThrowOnError extends boolean = false>(options?: Options<ArtistBlacklistData, ThrowOnError>): RequestResult<ArtistBlacklistResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<ArtistBlacklistResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/blacklist/artists',
    ...options
});

export const removeBlacklistedArtist = <ThrowOnError extends boolean = false>(options: Options<RemoveBlacklistedArtistData, ThrowOnError>): RequestResult<RemoveBlacklistedArtistResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<RemoveBlacklistedArtistResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/blacklist/artist/{artistId}',
    ...options
});

export const blacklistArtist = <ThrowOnError extends boolean = false>(options: Options<BlacklistArtistData, ThrowOnError>): RequestResult<BlacklistArtistResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<BlacklistArtistResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/blacklist/artist/{artistId}',
    ...options
});

export const greenlist = <ThrowOnError extends boolean = false>(options?: Options<GreenlistData, ThrowOnError>): RequestResult<GreenlistResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<GreenlistResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/greenlist',
    ...options
});

export const greenlistSong = <ThrowOnError extends boolean = false>(options: Options<GreenlistSongData, ThrowOnError>): RequestResult<GreenlistSongResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<GreenlistSongResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/greenlist',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const removeGreenlistedSong = <ThrowOnError extends boolean = false>(options: Options<RemoveGreenlistedSongData, ThrowOnError>): RequestResult<RemoveGreenlistedSongResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<RemoveGreenlistedSongResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/Moderation/greenlist/{songId}',
    ...options
});

export const playerStatus = <ThrowOnError extends boolean = false>(options?: Options<PlayerStatusData, ThrowOnError>): RequestResult<PlayerStatusResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<PlayerStatusResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/player/status',
    ...options
});

export const setVolume = <ThrowOnError extends boolean = false>(options: Options<SetVolumeData, ThrowOnError>): RequestResult<SetVolumeResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<SetVolumeResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/player/volume',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const pausePlayer = <ThrowOnError extends boolean = false>(options?: Options<PausePlayerData, ThrowOnError>): RequestResult<PausePlayerResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).post<PausePlayerResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/player/pause',
    ...options
});

export const resumePlayer = <ThrowOnError extends boolean = false>(options?: Options<ResumePlayerData, ThrowOnError>): RequestResult<ResumePlayerResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).post<ResumePlayerResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/player/resume',
    ...options
});

export const stopPlayer = <ThrowOnError extends boolean = false>(options?: Options<StopPlayerData, ThrowOnError>): RequestResult<StopPlayerResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).post<StopPlayerResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/player/stop',
    ...options
});

export const mutePlayer = <ThrowOnError extends boolean = false>(options?: Options<MutePlayerData, ThrowOnError>): RequestResult<MutePlayerResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).post<MutePlayerResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/player/mute',
    ...options
});

export const skipTrack = <ThrowOnError extends boolean = false>(options?: Options<SkipTrackData, ThrowOnError>): RequestResult<SkipTrackResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).post<SkipTrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/player/skip',
    ...options
});

export const playFile = <ThrowOnError extends boolean = false>(options: Options<PlayFileData, ThrowOnError>): RequestResult<PlayFileResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<PlayFileResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/player/play-file',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const uploadAndPlay = <ThrowOnError extends boolean = false>(options: Options<UploadAndPlayData, ThrowOnError>): RequestResult<UploadAndPlayResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<UploadAndPlayResponses, unknown, ThrowOnError, 'data'>({
    ...formDataBodySerializer,
    responseStyle: 'data',
    url: '/api/player/upload-and-play',
    ...options,
    headers: {
        'Content-Type': null,
        ...options.headers
    }
});

export const dashboard = <ThrowOnError extends boolean = false>(options?: Options<DashboardData, ThrowOnError>): RequestResult<DashboardResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<DashboardResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/statistics/dashboard',
    ...options
});

export const users = <ThrowOnError extends boolean = false>(options?: Options<UsersData, ThrowOnError>): RequestResult<UsersResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<UsersResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/users',
    ...options
});

export const updateRole = <ThrowOnError extends boolean = false>(options: Options<UpdateRoleData, ThrowOnError>): RequestResult<UpdateRoleResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).put<UpdateRoleResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/users/{id}/role',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const weekly = <ThrowOnError extends boolean = false>(options?: Options<WeeklyData, ThrowOnError>): RequestResult<WeeklyResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<WeeklyResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/schedule/weekly',
    ...options
});

export const updateWeekday = <ThrowOnError extends boolean = false>(options: Options<UpdateWeekdayData, ThrowOnError>): RequestResult<UpdateWeekdayResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).put<UpdateWeekdayResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/schedule/weekly/{weekday}',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const weeklyBreaks = <ThrowOnError extends boolean = false>(options: Options<WeeklyBreaksData, ThrowOnError>): RequestResult<WeeklyBreaksResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).get<WeeklyBreaksResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/schedule/weekly/{weekday}/breaks',
    ...options
});

export const updateWeeklyBreak = <ThrowOnError extends boolean = false>(options: Options<UpdateWeeklyBreakData, ThrowOnError>): RequestResult<UpdateWeeklyBreakResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).put<UpdateWeeklyBreakResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/schedule/weekly/{weekday}/breaks/{breakNo}',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const templates = <ThrowOnError extends boolean = false>(options?: Options<TemplatesData, ThrowOnError>): RequestResult<TemplatesResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<TemplatesResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/templates',
    ...options
});

export const createTemplate = <ThrowOnError extends boolean = false>(options: Options<CreateTemplateData, ThrowOnError>): RequestResult<CreateTemplateResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<CreateTemplateResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/templates',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const deleteTemplate = <ThrowOnError extends boolean = false>(options: Options<DeleteTemplateData, ThrowOnError>): RequestResult<DeleteTemplateResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<DeleteTemplateResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/templates/{id}',
    ...options
});

export const updateTemplate = <ThrowOnError extends boolean = false>(options: Options<UpdateTemplateData, ThrowOnError>): RequestResult<UpdateTemplateResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).put<UpdateTemplateResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/templates/{id}',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const updateBaseBreaks = <ThrowOnError extends boolean = false>(options: Options<UpdateBaseBreaksData, ThrowOnError>): RequestResult<UpdateBaseBreaksResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).put<UpdateBaseBreaksResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/update-break',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const exceptionDays = <ThrowOnError extends boolean = false>(options?: Options<ExceptionDaysData, ThrowOnError>): RequestResult<ExceptionDaysResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<ExceptionDaysResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/exceptions',
    ...options
});

export const createExceptionDay = <ThrowOnError extends boolean = false>(options: Options<CreateExceptionDayData, ThrowOnError>): RequestResult<CreateExceptionDayResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<CreateExceptionDayResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/exceptions',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const deleteExceptionDay = <ThrowOnError extends boolean = false>(options: Options<DeleteExceptionDayData, ThrowOnError>): RequestResult<DeleteExceptionDayResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<DeleteExceptionDayResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/exceptions/{id}',
    ...options
});

export const exceptionBreaks = <ThrowOnError extends boolean = false>(options?: Options<ExceptionBreaksData, ThrowOnError>): RequestResult<ExceptionBreaksResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<ExceptionBreaksResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/exception-breaks',
    ...options
});

export const createExceptionBreak = <ThrowOnError extends boolean = false>(options: Options<CreateExceptionBreakData, ThrowOnError>): RequestResult<CreateExceptionBreakResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<CreateExceptionBreakResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/exception-breaks',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const deleteExceptionBreak = <ThrowOnError extends boolean = false>(options: Options<DeleteExceptionBreakData, ThrowOnError>): RequestResult<DeleteExceptionBreakResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<DeleteExceptionBreakResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/breaks/exception-breaks/{id}',
    ...options
});

export const events = <ThrowOnError extends boolean = false>(options?: Options<EventsData, ThrowOnError>): RequestResult<EventsResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<EventsResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/special-events',
    ...options
});

export const createEvent = <ThrowOnError extends boolean = false>(options: Options<CreateEventData, ThrowOnError>): RequestResult<CreateEventResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<CreateEventResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/special-events',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const deleteEvent = <ThrowOnError extends boolean = false>(options: Options<DeleteEventData, ThrowOnError>): RequestResult<DeleteEventResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<DeleteEventResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/special-events/{id}',
    ...options
});

export const updateEvent = <ThrowOnError extends boolean = false>(options: Options<UpdateEventData, ThrowOnError>): RequestResult<UpdateEventResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).put<UpdateEventResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/special-events/{id}',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const fallbackTracks = <ThrowOnError extends boolean = false>(options?: Options<FallbackTracksData, ThrowOnError>): RequestResult<FallbackTracksResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<FallbackTracksResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/default-songs',
    ...options
});

export const addFallbackTrack = <ThrowOnError extends boolean = false>(options: Options<AddFallbackTrackData, ThrowOnError>): RequestResult<AddFallbackTrackResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<AddFallbackTrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/default-songs',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const removeFallbackTrack = <ThrowOnError extends boolean = false>(options: Options<RemoveFallbackTrackData, ThrowOnError>): RequestResult<RemoveFallbackTrackResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<RemoveFallbackTrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/default-songs/{id}',
    ...options
});

export const adminTracks = <ThrowOnError extends boolean = false>(options?: Options<AdminTracksData, ThrowOnError>): RequestResult<AdminTracksResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<AdminTracksResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/tracks',
    ...options
});

export const createTrack = <ThrowOnError extends boolean = false>(options: Options<CreateTrackData, ThrowOnError>): RequestResult<CreateTrackResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<CreateTrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/tracks',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const deleteTrack = <ThrowOnError extends boolean = false>(options: Options<DeleteTrackData, ThrowOnError>): RequestResult<DeleteTrackResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).delete<DeleteTrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/tracks/{id}',
    ...options
});

export const adminTrack = <ThrowOnError extends boolean = false>(options: Options<AdminTrackData, ThrowOnError>): RequestResult<AdminTrackResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).get<AdminTrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/tracks/{id}',
    ...options
});

export const updateTrack = <ThrowOnError extends boolean = false>(options: Options<UpdateTrackData, ThrowOnError>): RequestResult<UpdateTrackResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).put<UpdateTrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/tracks/{id}',
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...options.headers
    }
});

export const restoreTrack = <ThrowOnError extends boolean = false>(options: Options<RestoreTrackData, ThrowOnError>): RequestResult<RestoreTrackResponses, unknown, ThrowOnError, 'data'> => (options.client ?? client).post<RestoreTrackResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/admin/tracks/{id}/restore',
    ...options
});

export const spotifyStatus = <ThrowOnError extends boolean = false>(options?: Options<SpotifyStatusData, ThrowOnError>): RequestResult<SpotifyStatusResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<SpotifyStatusResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/spotify-playback/status',
    ...options
});

export const spotifyConnect = <ThrowOnError extends boolean = false>(options?: Options<SpotifyConnectData, ThrowOnError>): RequestResult<SpotifyConnectResponses, unknown, ThrowOnError, 'data'> => (options?.client ?? client).get<SpotifyConnectResponses, unknown, ThrowOnError, 'data'>({
    responseStyle: 'data',
    url: '/api/spotify-playback/connect',
    ...options
});
