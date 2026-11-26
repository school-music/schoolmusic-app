
export type ClientOptions = {
    baseUrl: `${string}://${string}` | (string & {});
};

export type AddDefaultSongDto = {
    songId: number | string;
};

export type AddSongToBlacklistDto = {
    songId: null | number | string;
    artistId: null | number | string;
};

export type AddSongToGreenlistDto = {
    songId: number | string;
};

export type BreakTemplateDto = {
    id: number | string;
    breakNumber: number | string;
    startsTime: string;
    endsTime: string;
};

export type CreateBreakTemplateDto = {
    breakNumber: number | string;
    startsTime: string;
    endsTime: string;
};

export type CreateExceptionBreakDto = {
    breakDate: string;
    breakNumber: number | string;
    musicEnabled?: boolean;
    description?: null | string;
};

export type CreateExceptionDayDto = {
    startDate: string;
    endDate: null | string;
    dayType: null | string;
    description: null | string;
};

export type CreateSpecialEventDto = {
    title: null | string;
    fileUrl: string;
    startsAt: string;
    eventStatus?: null | string;
};

export type CreateTrackDto = {
    title: string;
    artistName: string;
    genre: null | string;
    durationMs: number | string;
    songUrl: null | string;
    cover: null | string;
    source?: null | string;
    spotifyId?: null | string;
};

export type IFormFile = Blob | File;

export type PlayFileDto = {
    pathOrUrl: string;
    title: null | string;
    artist: null | string;
};

export type ProposeSongDto = {
    songId?: null | number | string;
    spotifyId?: null | string;
    breakId?: null | number | string;
    title?: null | string;
    artist?: null | string;
    genre?: null | string;
    mp3Url?: null | string;
};

export type ReorderQueueDto = {
    queueItemIds: Array<number | string>;
};

export type SchoolLoginDto = {
    login?: string;
    password?: string;
};

export type SetVolumeDto = {
    volume: number | string;
};

export type UpdateBreakScheduleItemDto = {
    id: number | string;
    startAt: string;
    endsAt: string;
    voteEnds?: null | string;
};

export type UpdateBreakTemplateDto = {
    breakNumber: number | string;
    startsTime: string;
    endsTime: string;
};

export type UpdateSpecialEventDto = {
    title: null | string;
    fileUrl: string;
    startsAt: string;
    eventStatus: string;
};

export type UpdateTrackDto = {
    title: null | string;
    artistName: null | string;
    genre: null | string;
    durationMs: null | number | string;
    songUrl: null | string;
    cover: null | string;
    source: null | string;
    spotifyId: null | string;
    isActive: null | boolean;
};

export type UpdateUserRoleDto = {
    rankId: number | string;
};

export type UpdateWeeklyBreakDto = {
    musicEnabled: boolean;
};

export type UpdateWeeklyDayDto = {
    musicEnabled: boolean;
};

export type UserLoginDto = {
    name?: string;
    password?: string;
};

export type UserRegisterDto = {
    name?: string;
    password?: string;
};

export type VoteRequestDto = {
    queueItemId: null | number | string;
    songId?: null | number | string;
    breakId?: null | number | string;
};

export type MobileLogin = {
    jwtSecurityToken: string;
    userId: number;
    username: string;
    role: string;
    isLdap: boolean;
};

export type MobileTrack = {
    title: string;
    artistName: string;
    cover: string | null;
    durationMs: number;
    id: number;
    artistId: number;
    genre: string | null;
    source: string;
    songUrl: string | null;
    spotifyId: string | null;
    votesCount: number;
    isFavorite: boolean;
    queueItemId: number | null;
    queueStatus: string | null;
};

export type MobileTrackPage = {
    items: Array<MobileTrack>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    targetBreakId: number | null;
};

export type MobileSpotifyTrack = {
    title: string;
    artist: string;
    cover: string | null;
    durationMs: number;
    externalId: string;
};

export type MobileFavorite = {
    id: number;
    title: string;
    cover: string | null;
    durationMs: number;
    spotifyId: string | null;
};

export type MobileQueueTrack = {
    title: string;
    artistName: string;
    cover: string | null;
    durationMs: number;
    position: number;
    songId: number;
    queueItemId: number;
    votesCount: number;
    hasVoted: boolean;
    orderIndex: number;
    submittedBy: string;
};

export type MobileTopTrack = {
    title: string;
    artistName: string;
    cover: string | null;
    durationMs: number;
    position: number;
    songId: number;
    queueItemId: number;
    votesCount: number;
};

export type MobileSystemStatus = {
    currentState: string;
    serverTime: string;
    musicEnabled: boolean;
    message: string;
    muteReason: string | null;
    secondsRemaining: number;
    breakEndsAt: string | null;
    nextBreakStartsAt: string | null;
    currentBreakNumber: number | null;
    nextBreakNumber: number | null;
    topTracks: Array<MobileTopTrack>;
    nowPlaying: {
        title: string;
        artistName: string;
        cover: string | null;
        durationMs: number;
        songId: number;
        queueItemId: number;
        votesCount: number;
        startedAt: string | null;
        elapsedSeconds: number;
        remainingSeconds: number;
        isPaused: boolean;
    } | null;
};

export type MobileBreak = {
    id: number;
    breakNumber: number;
    startAt: string;
    endsAt: string;
    voteEnds: string | null;
    isMuted: boolean;
    muteReason: string | null;
};

export type MobileCalendarBreak = {
    breakNumber: number;
    startAt: string;
    endsAt: string;
    startsTime: string;
    endsTime: string;
    isMusicEnabled: boolean;
    isOverridden: boolean;
    ruleSource: string;
    reason: string | null;
};

export type MobileCalendarDay = {
    date: string;
    dayName: string;
    isSchoolDay: boolean;
    isMusicEnabled: boolean;
    statusDescription: string;
    breaks: Array<MobileCalendarBreak>;
};

export type MobileSongRank = {
    title: string;
    artistName: string;
    cover: string | null;
    durationMs: number;
    songId: number;
    position: number;
    playsCount: number;
    totalVotes: number;
};

export type MobileArtistRank = {
    position: number;
    artistId: number;
    artistName: string;
    playsCount: number;
    totalVotes: number;
};

export type MobileHistory = {
    historyId: number;
    songId: number;
    title: string;
    artistName: string;
    cover: string | null;
    playedAt: string;
    breakNumber: number | null;
    votesCount: number;
};

export type MobileProposal = {
    id: string;
    songId: number;
    title: string | null;
    artist: string | null;
    durationMs: number;
    cover: string | null;
    breakId: number;
    breakNumber: number | null;
    userId: number;
    submittedBy: string | null;
};

export type MobileBan = {
    id: number;
    userId: number;
    username: string;
    reason: string | null;
    bannedAt: string;
};

export type MobileModeratedSong = {
    title: string;
    artistName: string;
    cover: string | null;
    durationMs: number;
    id: number;
    songId: number;
    artistId: number;
    genre: string | null;
};

export type MobileModeratedArtist = {
    id: number;
    artistId: number;
    artistName: string;
};

export type MobilePlayer = {
    isPlaying: boolean;
    isPaused: boolean;
    volume: number;
    isMuted: boolean;
    source: string;
    title: string | null;
    artist: string | null;
    currentPositionMs: number;
    totalDurationMs: number;
};

export type MobileUser = {
    id: number;
    userLogin: string;
    rankId: number;
    rankName: string;
    createdAt: string;
    passwordChangedAt: string | null;
};

export type MobileWeeklyDay = {
    weekday: number;
    dayName: string;
    musicEnabled: boolean;
};

export type MobileWeeklyBreak = {
    breakNumber: number;
    startsTime: string;
    endsTime: string;
    musicEnabled: boolean;
    isOverridden: boolean;
};

export type MobileTemplate = {
    id: number;
    breakNumber: number;
    startsTime: string;
    endsTime: string;
};

export type MobileExceptionDay = {
    id: number;
    startDate: string;
    endDate: string;
    dayType: string;
    description: string | null;
};

export type MobileExceptionBreak = {
    id: number;
    breakDate: string;
    breakNumber: number;
    musicEnabled: boolean;
    description: string | null;
};

export type MobileEvent = {
    id: number;
    title: string | null;
    fileUrl: string;
    startsAt: string;
    eventStatus: string;
};

export type MobileFallbackTrack = {
    title: string;
    artistName: string;
    cover: string | null;
    durationMs: number;
    id: number;
    songId: number;
    artistId: number;
    genre: string | null;
    isActive: boolean;
    songUrl: string | null;
};

export type MobileAdminTrack = {
    title: string;
    artistName: string;
    cover: string | null;
    durationMs: number;
    id: number;
    artistId: number;
    genre: string | null;
    isActive: boolean;
    songUrl: string | null;
    source: string;
    spotifyId: string | null;
    createdAt: string;
    totalPlaysCount: number;
    currentQueueVotesCount: number;
};

export type MobileSpotifyStatus = {
    configured: boolean;
    connected: boolean;
    deviceName: string;
    deviceAvailable: boolean;
    needsReauthorization: boolean;
    message: string | null;
};

export type MobileDashboard = {
    generatedAt: string;
    isAvailable: boolean;
    votes: {
        total: number;
        thisWeek: number;
        today: number;
    };
    genres: Array<{
        genre: string;
        playsCount: number;
        sharePercent: number;
    }>;
    dailyActivity: Array<{
        date: string;
        votesCount: number;
        playsCount: number;
    }>;
    topSongs: Array<{
        title: string;
        artistName: string;
        songId: number;
        playsCount: number;
        totalVotes: number;
        position: number;
    }>;
    topArtists: Array<MobileArtistRank>;
};

export type LoginData = {
    body: UserLoginDto;
    path?: never;
    query?: never;
    url: '/api/auth/login';
};

export type LoginResponses = {
    200: MobileLogin;
};

export type LoginResponse = LoginResponses[keyof LoginResponses];

export type RegisterData = {
    body: UserRegisterDto;
    path?: never;
    query?: never;
    url: '/api/auth/register';
};

export type RegisterResponses = {
    201: {
        id: number;
        username: string;
        message: string;
    };
};

export type RegisterResponse = RegisterResponses[keyof RegisterResponses];

export type DeleteAccountData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/auth/delete-acc';
};

export type DeleteAccountResponses = {
    200: unknown;
    204: void;
};

export type DeleteAccountResponse = DeleteAccountResponses[keyof DeleteAccountResponses];

export type SystemStatusData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/system/status';
};

export type SystemStatusResponses = {
    200: MobileSystemStatus;
};

export type SystemStatusResponse = SystemStatusResponses[keyof SystemStatusResponses];

export type TracksData = {
    body?: never;
    path?: never;
    query?: {
        search?: string;
        genre?: string;
        breakId?: number | string;
        page?: number | string;
        pageSize?: number | string;
        sortBy?: string;
        sortOrder?: string;
    };
    url: '/api/Tracks';
};

export type TracksResponses = {
    200: MobileTrackPage;
};

export type TracksResponse = TracksResponses[keyof TracksResponses];

export type SpotifySearchData = {
    body?: never;
    headers?: {
        q?: string;
    };
    path?: never;
    query?: {
        q?: string;
        query?: string;
    };
    url: '/api/Tracks/search';
};

export type SpotifySearchResponses = {
    200: Array<MobileSpotifyTrack>;
};

export type SpotifySearchResponse = SpotifySearchResponses[keyof SpotifySearchResponses];

export type TrackData = {
    body?: never;
    path: {
        id: number;
    };
    query?: {
        breakId?: number | string;
    };
    url: '/api/Tracks/{id}';
};

export type TrackResponses = {
    200: MobileTrack;
};

export type TrackResponse = TrackResponses[keyof TrackResponses];

export type FavoritesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/Tracks/favourites';
};

export type FavoritesResponses = {
    200: {
        tracks: Array<MobileFavorite>;
    };
};

export type FavoritesResponse = FavoritesResponses[keyof FavoritesResponses];

export type AddFavoriteData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/Tracks/{id}/favourites';
};

export type AddFavoriteResponses = {
    200: {
        message?: string;
    };
};

export type AddFavoriteResponse = AddFavoriteResponses[keyof AddFavoriteResponses];

export type RemoveFavoriteData = {
    body?: never;
    path: {
        id: number | string;
    };
    query?: never;
    url: '/api/Tracks/favourites/{id}';
};

export type RemoveFavoriteResponses = {
    200: {
        message?: string;
    };
};

export type RemoveFavoriteResponse = RemoveFavoriteResponses[keyof RemoveFavoriteResponses];

export type QueueForBreakData = {
    body?: never;
    path: {
        breakId: number;
    };
    query?: {
        breakId?: number | string;
    };
    url: '/api/Queue/break/{breakId}';
};

export type QueueForBreakResponses = {
    200: {
        breakId: number;
        breakNumber: number;
        totalSongs: number;
        queue: Array<MobileQueueTrack>;
    };
};

export type QueueForBreakResponse = QueueForBreakResponses[keyof QueueForBreakResponses];

export type ProposeData = {
    body: ProposeSongDto;
    path?: never;
    query?: never;
    url: '/api/Queue/propose';
};

export type ProposeResponses = {
    201: {
        status: string;
        message: string;
    };
    202: {
        status: string;
        message: string;
    };
};

export type ProposeResponse = ProposeResponses[keyof ProposeResponses];

export type VoteData = {
    body: VoteRequestDto;
    path?: never;
    query?: never;
    url: '/api/Queue/vote';
};

export type VoteResponses = {
    200: {
        message?: string;
    };
};

export type VoteResponse = VoteResponses[keyof VoteResponses];

export type UndoVoteData = {
    body?: never;
    path: {
        queueItemId: number;
    };
    query?: never;
    url: '/api/Queue/vote/{queueItemId}';
};

export type UndoVoteResponses = {
    200: {
        message?: string;
    };
};

export type UndoVoteResponse = UndoVoteResponses[keyof UndoVoteResponses];

export type ArchiveData = {
    body?: never;
    path: {
        breakId: number;
    };
    query?: never;
    url: '/api/Queue/break/{breakId}/archive';
};

export type ArchiveResponses = {
    200: {
        message?: string;
    };
};

export type ArchiveResponse = ArchiveResponses[keyof ArchiveResponses];

export type ReorderQueueData = {
    body: ReorderQueueDto;
    path: {
        breakId: number;
    };
    query?: never;
    url: '/api/Queue/break/{breakId}/order';
};

export type ReorderQueueResponses = {
    200: {
        message?: string;
    };
};

export type ReorderQueueResponse = ReorderQueueResponses[keyof ReorderQueueResponses];

export type BreaksData = {
    body?: never;
    path?: never;
    query?: {
        date?: string;
    };
    url: '/api/breaks';
};

export type BreaksResponses = {
    200: {
        date: string;
        przerwy: Array<MobileBreak>;
        message: string;
    };
};

export type BreaksResponse = BreaksResponses[keyof BreaksResponses];

export type CalendarData = {
    body?: never;
    path?: never;
    query?: {
        from?: string;
        to?: string;
    };
    url: '/api/schedule/calendar';
};

export type CalendarResponses = {
    200: {
        days: Array<MobileCalendarDay>;
    };
};

export type CalendarResponse = CalendarResponses[keyof CalendarResponses];

export type SongsRankingData = {
    body?: never;
    path?: never;
    query?: {
        period?: string;
        limit?: number | string;
    };
    url: '/api/Rankings/songs';
};

export type SongsRankingResponses = {
    200: {
        songs: Array<MobileSongRank>;
    };
};

export type SongsRankingResponse = SongsRankingResponses[keyof SongsRankingResponses];

export type ArtistsRankingData = {
    body?: never;
    path?: never;
    query?: {
        period?: string;
        limit?: number | string;
    };
    url: '/api/Rankings/artists';
};

export type ArtistsRankingResponses = {
    200: {
        artists: Array<MobileArtistRank>;
    };
};

export type ArtistsRankingResponse = ArtistsRankingResponses[keyof ArtistsRankingResponses];

export type PlaybackHistoryData = {
    body?: never;
    path?: never;
    query?: {
        limit?: number | string;
        offset?: number | string;
    };
    url: '/api/Rankings/history';
};

export type PlaybackHistoryResponses = {
    200: {
        history: Array<MobileHistory>;
    };
};

export type PlaybackHistoryResponse = PlaybackHistoryResponses[keyof PlaybackHistoryResponses];

export type PendingData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/Moderation/pending';
};

export type PendingResponses = {
    200: {
        proposals: Array<MobileProposal>;
    };
};

export type PendingResponse = PendingResponses[keyof PendingResponses];

export type ApproveData = {
    body?: never;
    path: {
        proposalId: string;
    };
    query?: never;
    url: '/api/Moderation/approve/{proposalId}';
};

export type ApproveResponses = {
    200: {
        message?: string;
    };
};

export type ApproveResponse = ApproveResponses[keyof ApproveResponses];

export type DenyData = {
    body?: never;
    path: {
        proposalId: string;
    };
    query?: {
        addToBlacklist?: boolean;
    };
    url: '/api/Moderation/deny/{proposalId}';
};

export type DenyResponses = {
    200: {
        message?: string;
    };
};

export type DenyResponse = DenyResponses[keyof DenyResponses];

export type BansData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/Moderation/banned';
};

export type BansResponses = {
    200: {
        bannedUsers: Array<MobileBan>;
    };
};

export type BansResponse = BansResponses[keyof BansResponses];

export type BanData = {
    body?: never;
    path: {
        userId: number;
    };
    query?: never;
    url: '/api/Moderation/ban/{userId}';
};

export type BanResponses = {
    200: {
        message?: string;
    };
};

export type BanResponse = BanResponses[keyof BanResponses];

export type LiftBanData = {
    body?: never;
    path: {
        banId: number;
    };
    query?: never;
    url: '/api/Moderation/unaban/{banId}';
};

export type LiftBanResponses = {
    200: {
        message?: string;
    };
};

export type LiftBanResponse = LiftBanResponses[keyof LiftBanResponses];

export type SongBlacklistData = {
    body?: never;
    path?: never;
    query?: {
        search?: string;
        page?: number | string;
        pageSize?: number | string;
    };
    url: '/api/Moderation/blacklist';
};

export type SongBlacklistResponses = {
    200: {
        items: Array<MobileModeratedSong>;
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
};

export type SongBlacklistResponse = SongBlacklistResponses[keyof SongBlacklistResponses];

export type BlacklistSongData = {
    body: AddSongToBlacklistDto;
    path?: never;
    query?: never;
    url: '/api/Moderation/blacklist';
};

export type BlacklistSongResponses = {
    200: {
        message?: string;
    };
};

export type BlacklistSongResponse = BlacklistSongResponses[keyof BlacklistSongResponses];

export type RemoveBlacklistedSongData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/Moderation/blacklist/{id}';
};

export type RemoveBlacklistedSongResponses = {
    200: {
        message?: string;
    };
};

export type RemoveBlacklistedSongResponse = RemoveBlacklistedSongResponses[keyof RemoveBlacklistedSongResponses];

export type ArtistBlacklistData = {
    body?: never;
    path?: never;
    query?: {
        search?: string;
        page?: number | string;
        pageSize?: number | string;
    };
    url: '/api/Moderation/blacklist/artists';
};

export type ArtistBlacklistResponses = {
    200: {
        items: Array<MobileModeratedArtist>;
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
};

export type ArtistBlacklistResponse = ArtistBlacklistResponses[keyof ArtistBlacklistResponses];

export type RemoveBlacklistedArtistData = {
    body?: never;
    path: {
        artistId: number;
    };
    query?: never;
    url: '/api/Moderation/blacklist/artist/{artistId}';
};

export type RemoveBlacklistedArtistResponses = {
    200: {
        message?: string;
    };
};

export type RemoveBlacklistedArtistResponse = RemoveBlacklistedArtistResponses[keyof RemoveBlacklistedArtistResponses];

export type BlacklistArtistData = {
    body?: never;
    path: {
        artistId: number;
    };
    query?: never;
    url: '/api/Moderation/blacklist/artist/{artistId}';
};

export type BlacklistArtistResponses = {
    200: {
        message?: string;
    };
};

export type BlacklistArtistResponse = BlacklistArtistResponses[keyof BlacklistArtistResponses];

export type GreenlistData = {
    body?: never;
    path?: never;
    query?: {
        search?: string;
        page?: number | string;
        pageSize?: number | string;
    };
    url: '/api/Moderation/greenlist';
};

export type GreenlistResponses = {
    200: {
        items: Array<MobileModeratedSong>;
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
};

export type GreenlistResponse = GreenlistResponses[keyof GreenlistResponses];

export type GreenlistSongData = {
    body: AddSongToGreenlistDto;
    path?: never;
    query?: never;
    url: '/api/Moderation/greenlist';
};

export type GreenlistSongResponses = {
    200: {
        message?: string;
    };
};

export type GreenlistSongResponse = GreenlistSongResponses[keyof GreenlistSongResponses];

export type RemoveGreenlistedSongData = {
    body?: never;
    path: {
        songId: number;
    };
    query?: never;
    url: '/api/Moderation/greenlist/{songId}';
};

export type RemoveGreenlistedSongResponses = {
    200: {
        message?: string;
    };
};

export type RemoveGreenlistedSongResponse = RemoveGreenlistedSongResponses[keyof RemoveGreenlistedSongResponses];

export type PlayerStatusData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/player/status';
};

export type PlayerStatusResponses = {
    200: MobilePlayer;
};

export type PlayerStatusResponse = PlayerStatusResponses[keyof PlayerStatusResponses];

export type SetVolumeData = {
    body: SetVolumeDto;
    path?: never;
    query?: never;
    url: '/api/player/volume';
};

export type SetVolumeResponses = {
    200: MobilePlayer;
};

export type SetVolumeResponse = SetVolumeResponses[keyof SetVolumeResponses];

export type PausePlayerData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/player/pause';
};

export type PausePlayerResponses = {
    200: {
        message?: string;
    };
};

export type PausePlayerResponse = PausePlayerResponses[keyof PausePlayerResponses];

export type ResumePlayerData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/player/resume';
};

export type ResumePlayerResponses = {
    200: {
        message?: string;
    };
};

export type ResumePlayerResponse = ResumePlayerResponses[keyof ResumePlayerResponses];

export type StopPlayerData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/player/stop';
};

export type StopPlayerResponses = {
    200: {
        message?: string;
    };
};

export type StopPlayerResponse = StopPlayerResponses[keyof StopPlayerResponses];

export type MutePlayerData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/player/mute';
};

export type MutePlayerResponses = {
    200: MobilePlayer;
};

export type MutePlayerResponse = MutePlayerResponses[keyof MutePlayerResponses];

export type SkipTrackData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/player/skip';
};

export type SkipTrackResponses = {
    200: {
        success: boolean;
    };
};

export type SkipTrackResponse = SkipTrackResponses[keyof SkipTrackResponses];

export type PlayFileData = {
    body: PlayFileDto;
    path?: never;
    query?: never;
    url: '/api/player/play-file';
};

export type PlayFileResponses = {
    200: {
        message?: string;
    };
};

export type PlayFileResponse = PlayFileResponses[keyof PlayFileResponses];

export type UploadAndPlayData = {
    body: {
        file?: IFormFile;
    } & {
        title?: string;
    } & {
        artist?: string;
    };
    path?: never;
    query?: never;
    url: '/api/player/upload-and-play';
};

export type UploadAndPlayResponses = {
    200: {
        message?: string;
    };
};

export type UploadAndPlayResponse = UploadAndPlayResponses[keyof UploadAndPlayResponses];

export type DashboardData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/statistics/dashboard';
};

export type DashboardResponses = {
    200: MobileDashboard;
};

export type DashboardResponse = DashboardResponses[keyof DashboardResponses];

export type UsersData = {
    body?: never;
    path?: never;
    query?: {
        page?: number | string;
        pageSize?: number | string;
        search?: string;
    };
    url: '/api/users';
};

export type UsersResponses = {
    200: {
        users: Array<MobileUser>;
        totalCount: number;
        totalPages: number;
    };
};

export type UsersResponse = UsersResponses[keyof UsersResponses];

export type UpdateRoleData = {
    body: UpdateUserRoleDto;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/users/{id}/role';
};

export type UpdateRoleResponses = {
    200: {
        message?: string;
    };
};

export type UpdateRoleResponse = UpdateRoleResponses[keyof UpdateRoleResponses];

export type WeeklyData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/schedule/weekly';
};

export type WeeklyResponses = {
    200: Array<MobileWeeklyDay>;
};

export type WeeklyResponse = WeeklyResponses[keyof WeeklyResponses];

export type UpdateWeekdayData = {
    body: UpdateWeeklyDayDto;
    path: {
        weekday: number;
    };
    query?: never;
    url: '/api/schedule/weekly/{weekday}';
};

export type UpdateWeekdayResponses = {
    200: {
        message?: string;
    };
};

export type UpdateWeekdayResponse = UpdateWeekdayResponses[keyof UpdateWeekdayResponses];

export type WeeklyBreaksData = {
    body?: never;
    path: {
        weekday: number;
    };
    query?: never;
    url: '/api/schedule/weekly/{weekday}/breaks';
};

export type WeeklyBreaksResponses = {
    200: {
        breaks: Array<MobileWeeklyBreak>;
    };
};

export type WeeklyBreaksResponse = WeeklyBreaksResponses[keyof WeeklyBreaksResponses];

export type UpdateWeeklyBreakData = {
    body: UpdateWeeklyBreakDto;
    path: {
        weekday: number;
        breakNo: number;
    };
    query?: never;
    url: '/api/schedule/weekly/{weekday}/breaks/{breakNo}';
};

export type UpdateWeeklyBreakResponses = {
    200: {
        message?: string;
    };
};

export type UpdateWeeklyBreakResponse = UpdateWeeklyBreakResponses[keyof UpdateWeeklyBreakResponses];

export type TemplatesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/breaks/templates';
};

export type TemplatesResponses = {
    200: Array<MobileTemplate>;
};

export type TemplatesResponse = TemplatesResponses[keyof TemplatesResponses];

export type CreateTemplateData = {
    body: CreateBreakTemplateDto;
    path?: never;
    query?: never;
    url: '/api/breaks/templates';
};

export type CreateTemplateResponses = {
    201: MobileTemplate;
};

export type CreateTemplateResponse = CreateTemplateResponses[keyof CreateTemplateResponses];

export type DeleteTemplateData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/breaks/templates/{id}';
};

export type DeleteTemplateResponses = {
    200: unknown;
    204: void;
};

export type DeleteTemplateResponse = DeleteTemplateResponses[keyof DeleteTemplateResponses];

export type UpdateTemplateData = {
    body: UpdateBreakTemplateDto;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/breaks/templates/{id}';
};

export type UpdateTemplateResponses = {
    200: {
        message?: string;
    };
};

export type UpdateTemplateResponse = UpdateTemplateResponses[keyof UpdateTemplateResponses];

export type UpdateBaseBreaksData = {
    body: Array<UpdateBreakScheduleItemDto>;
    path?: never;
    query?: never;
    url: '/api/breaks/update-break';
};

export type UpdateBaseBreaksResponses = {
    200: {
        message?: string;
    };
};

export type UpdateBaseBreaksResponse = UpdateBaseBreaksResponses[keyof UpdateBaseBreaksResponses];

export type ExceptionDaysData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/breaks/exceptions';
};

export type ExceptionDaysResponses = {
    200: {
        exceptions: Array<MobileExceptionDay>;
    };
};

export type ExceptionDaysResponse = ExceptionDaysResponses[keyof ExceptionDaysResponses];

export type CreateExceptionDayData = {
    body: CreateExceptionDayDto;
    path?: never;
    query?: never;
    url: '/api/breaks/exceptions';
};

export type CreateExceptionDayResponses = {
    200: {
        message?: string;
    };
};

export type CreateExceptionDayResponse = CreateExceptionDayResponses[keyof CreateExceptionDayResponses];

export type DeleteExceptionDayData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/breaks/exceptions/{id}';
};

export type DeleteExceptionDayResponses = {
    200: {
        message?: string;
    };
};

export type DeleteExceptionDayResponse = DeleteExceptionDayResponses[keyof DeleteExceptionDayResponses];

export type ExceptionBreaksData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/breaks/exception-breaks';
};

export type ExceptionBreaksResponses = {
    200: {
        exceptionBreaks: Array<MobileExceptionBreak>;
    };
};

export type ExceptionBreaksResponse = ExceptionBreaksResponses[keyof ExceptionBreaksResponses];

export type CreateExceptionBreakData = {
    body: CreateExceptionBreakDto;
    path?: never;
    query?: never;
    url: '/api/breaks/exception-breaks';
};

export type CreateExceptionBreakResponses = {
    200: {
        message?: string;
    };
};

export type CreateExceptionBreakResponse = CreateExceptionBreakResponses[keyof CreateExceptionBreakResponses];

export type DeleteExceptionBreakData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/breaks/exception-breaks/{id}';
};

export type DeleteExceptionBreakResponses = {
    200: {
        message?: string;
    };
};

export type DeleteExceptionBreakResponse = DeleteExceptionBreakResponses[keyof DeleteExceptionBreakResponses];

export type EventsData = {
    body?: never;
    path?: never;
    query?: {
        status?: string;
    };
    url: '/api/admin/special-events';
};

export type EventsResponses = {
    200: Array<MobileEvent>;
};

export type EventsResponse = EventsResponses[keyof EventsResponses];

export type CreateEventData = {
    body: CreateSpecialEventDto;
    path?: never;
    query?: never;
    url: '/api/admin/special-events';
};

export type CreateEventResponses = {
    201: MobileEvent;
};

export type CreateEventResponse = CreateEventResponses[keyof CreateEventResponses];

export type DeleteEventData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/admin/special-events/{id}';
};

export type DeleteEventResponses = {
    200: {
        message?: string;
    };
};

export type DeleteEventResponse = DeleteEventResponses[keyof DeleteEventResponses];

export type UpdateEventData = {
    body: UpdateSpecialEventDto;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/admin/special-events/{id}';
};

export type UpdateEventResponses = {
    200: MobileEvent;
};

export type UpdateEventResponse = UpdateEventResponses[keyof UpdateEventResponses];

export type FallbackTracksData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/admin/default-songs';
};

export type FallbackTracksResponses = {
    200: Array<MobileFallbackTrack>;
};

export type FallbackTracksResponse = FallbackTracksResponses[keyof FallbackTracksResponses];

export type AddFallbackTrackData = {
    body: AddDefaultSongDto;
    path?: never;
    query?: never;
    url: '/api/admin/default-songs';
};

export type AddFallbackTrackResponses = {
    201: MobileFallbackTrack;
};

export type AddFallbackTrackResponse = AddFallbackTrackResponses[keyof AddFallbackTrackResponses];

export type RemoveFallbackTrackData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/admin/default-songs/{id}';
};

export type RemoveFallbackTrackResponses = {
    200: {
        message?: string;
    };
};

export type RemoveFallbackTrackResponse = RemoveFallbackTrackResponses[keyof RemoveFallbackTrackResponses];

export type AdminTracksData = {
    body?: never;
    path?: never;
    query?: {
        search?: string;
        genre?: string;
        isActive?: boolean;
        page?: number | string;
        pageSize?: number | string;
        sortBy?: string;
        sortOrder?: string;
    };
    url: '/api/admin/tracks';
};

export type AdminTracksResponses = {
    200: {
        items: Array<MobileAdminTrack>;
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
};

export type AdminTracksResponse = AdminTracksResponses[keyof AdminTracksResponses];

export type CreateTrackData = {
    body: CreateTrackDto;
    path?: never;
    query?: never;
    url: '/api/admin/tracks';
};

export type CreateTrackResponses = {
    201: MobileAdminTrack;
};

export type CreateTrackResponse = CreateTrackResponses[keyof CreateTrackResponses];

export type DeleteTrackData = {
    body?: never;
    path: {
        id: number;
    };
    query?: {
        hardDelete?: boolean;
    };
    url: '/api/admin/tracks/{id}';
};

export type DeleteTrackResponses = {
    200: {
        message?: string;
    };
};

export type DeleteTrackResponse = DeleteTrackResponses[keyof DeleteTrackResponses];

export type AdminTrackData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/admin/tracks/{id}';
};

export type AdminTrackResponses = {
    200: MobileAdminTrack;
};

export type AdminTrackResponse = AdminTrackResponses[keyof AdminTrackResponses];

export type UpdateTrackData = {
    body: UpdateTrackDto;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/admin/tracks/{id}';
};

export type UpdateTrackResponses = {
    200: MobileAdminTrack;
};

export type UpdateTrackResponse = UpdateTrackResponses[keyof UpdateTrackResponses];

export type RestoreTrackData = {
    body?: never;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/admin/tracks/{id}/restore';
};

export type RestoreTrackResponses = {
    200: {
        message?: string;
    };
};

export type RestoreTrackResponse = RestoreTrackResponses[keyof RestoreTrackResponses];

export type SpotifyStatusData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/spotify-playback/status';
};

export type SpotifyStatusResponses = {
    200: MobileSpotifyStatus;
};

export type SpotifyStatusResponse = SpotifyStatusResponses[keyof SpotifyStatusResponses];

export type SpotifyConnectData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/spotify-playback/connect';
};

export type SpotifyConnectResponses = {
    200: unknown;
};
