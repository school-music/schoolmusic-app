
import { type DefaultError, queryOptions, type UseMutationOptions } from '@tanstack/react-query';

import { client } from '../client.gen';
import { addFallbackTrack, addFavorite, adminTrack, adminTracks, approve, archive, artistBlacklist, artistsRanking, ban, bans, blacklistArtist, blacklistSong, breaks, calendar, createEvent, createExceptionBreak, createExceptionDay, createTemplate, createTrack, dashboard, deleteAccount, deleteEvent, deleteExceptionBreak, deleteExceptionDay, deleteTemplate, deleteTrack, deny, events, exceptionBreaks, exceptionDays, fallbackTracks, favorites, greenlist, greenlistSong, liftBan, login, mutePlayer, type Options, pausePlayer, pending, playbackHistory, playerStatus, playFile, propose, queueForBreak, register, removeBlacklistedArtist, removeBlacklistedSong, removeFallbackTrack, removeFavorite, removeGreenlistedSong, reorderQueue, restoreTrack, resumePlayer, setVolume, skipTrack, songBlacklist, songsRanking, spotifyConnect, spotifySearch, spotifyStatus, stopPlayer, systemStatus, templates, track, tracks, undoVote, updateBaseBreaks, updateEvent, updateRole, updateTemplate, updateTrack, updateWeekday, updateWeeklyBreak, uploadAndPlay, users, vote, weekly, weeklyBreaks } from '../sdk.gen';
import type { AddFallbackTrackData, AddFallbackTrackResponse, AddFavoriteData, AddFavoriteResponse, AdminTrackData, AdminTrackResponse, AdminTracksData, AdminTracksResponse, ApproveData, ApproveResponse, ArchiveData, ArchiveResponse, ArtistBlacklistData, ArtistBlacklistResponse, ArtistsRankingData, ArtistsRankingResponse, BanData, BanResponse, BansData, BansResponse, BlacklistArtistData, BlacklistArtistResponse, BlacklistSongData, BlacklistSongResponse, BreaksData, BreaksResponse, CalendarData, CalendarResponse, CreateEventData, CreateEventResponse, CreateExceptionBreakData, CreateExceptionBreakResponse, CreateExceptionDayData, CreateExceptionDayResponse, CreateTemplateData, CreateTemplateResponse, CreateTrackData, CreateTrackResponse, DashboardData, DashboardResponse, DeleteAccountData, DeleteAccountResponse, DeleteEventData, DeleteEventResponse, DeleteExceptionBreakData, DeleteExceptionBreakResponse, DeleteExceptionDayData, DeleteExceptionDayResponse, DeleteTemplateData, DeleteTemplateResponse, DeleteTrackData, DeleteTrackResponse, DenyData, DenyResponse, EventsData, EventsResponse, ExceptionBreaksData, ExceptionBreaksResponse, ExceptionDaysData, ExceptionDaysResponse, FallbackTracksData, FallbackTracksResponse, FavoritesData, FavoritesResponse, GreenlistData, GreenlistResponse, GreenlistSongData, GreenlistSongResponse, LiftBanData, LiftBanResponse, LoginData, LoginResponse, MutePlayerData, MutePlayerResponse, PausePlayerData, PausePlayerResponse, PendingData, PendingResponse, PlaybackHistoryData, PlaybackHistoryResponse, PlayerStatusData, PlayerStatusResponse, PlayFileData, PlayFileResponse, ProposeData, ProposeResponse, QueueForBreakData, QueueForBreakResponse, RegisterData, RegisterResponse, RemoveBlacklistedArtistData, RemoveBlacklistedArtistResponse, RemoveBlacklistedSongData, RemoveBlacklistedSongResponse, RemoveFallbackTrackData, RemoveFallbackTrackResponse, RemoveFavoriteData, RemoveFavoriteResponse, RemoveGreenlistedSongData, RemoveGreenlistedSongResponse, ReorderQueueData, ReorderQueueResponse, RestoreTrackData, RestoreTrackResponse, ResumePlayerData, ResumePlayerResponse, SetVolumeData, SetVolumeResponse, SkipTrackData, SkipTrackResponse, SongBlacklistData, SongBlacklistResponse, SongsRankingData, SongsRankingResponse, SpotifyConnectData, SpotifySearchData, SpotifySearchResponse, SpotifyStatusData, SpotifyStatusResponse, StopPlayerData, StopPlayerResponse, SystemStatusData, SystemStatusResponse, TemplatesData, TemplatesResponse, TrackData, TrackResponse, TracksData, TracksResponse, UndoVoteData, UndoVoteResponse, UpdateBaseBreaksData, UpdateBaseBreaksResponse, UpdateEventData, UpdateEventResponse, UpdateRoleData, UpdateRoleResponse, UpdateTemplateData, UpdateTemplateResponse, UpdateTrackData, UpdateTrackResponse, UpdateWeekdayData, UpdateWeekdayResponse, UpdateWeeklyBreakData, UpdateWeeklyBreakResponse, UploadAndPlayData, UploadAndPlayResponse, UsersData, UsersResponse, VoteData, VoteResponse, WeeklyBreaksData, WeeklyBreaksResponse, WeeklyData, WeeklyResponse } from '../types.gen';

export const loginMutation = (options?: Partial<Options<LoginData>>): UseMutationOptions<LoginResponse, DefaultError, Options<LoginData>> => {
    const mutationOptions: UseMutationOptions<LoginResponse, DefaultError, Options<LoginData>> = {
        mutationFn: async (fnOptions) => await login({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const registerMutation = (options?: Partial<Options<RegisterData>>): UseMutationOptions<RegisterResponse, DefaultError, Options<RegisterData>> => {
    const mutationOptions: UseMutationOptions<RegisterResponse, DefaultError, Options<RegisterData>> = {
        mutationFn: async (fnOptions) => await register({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const deleteAccountMutation = (options?: Partial<Options<DeleteAccountData>>): UseMutationOptions<DeleteAccountResponse, DefaultError, Options<DeleteAccountData>> => {
    const mutationOptions: UseMutationOptions<DeleteAccountResponse, DefaultError, Options<DeleteAccountData>> = {
        mutationFn: async (fnOptions) => await deleteAccount({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export type QueryKey<TOptions extends Options> = [
    Pick<TOptions, 'baseUrl' | 'body' | 'headers' | 'path' | 'query'> & {
        _id: string;
        _infinite?: boolean;
        tags?: ReadonlyArray<string>;
    }
];

const createQueryKey = <TOptions extends Options>(id: string, options?: TOptions, infinite?: boolean, tags?: ReadonlyArray<string>): [
    QueryKey<TOptions>[0]
] => {
    const params: QueryKey<TOptions>[0] = { _id: id, baseUrl: options?.baseUrl || (options?.client ?? client).getConfig().baseUrl } as QueryKey<TOptions>[0];
    if (infinite) {
        params._infinite = infinite;
    }
    if (tags) {
        params.tags = tags;
    }
    if (options?.body) {
        params.body = options.body;
    }
    if (options?.headers) {
        params.headers = options.headers;
    }
    if (options?.path) {
        params.path = options.path;
    }
    if (options?.query) {
        params.query = options.query;
    }
    return [params];
};

export const systemStatusQueryKey = (options?: Options<SystemStatusData>) => createQueryKey('systemStatus', options);

export const systemStatusOptions = (options?: Options<SystemStatusData>) => queryOptions<SystemStatusResponse, DefaultError, SystemStatusResponse, ReturnType<typeof systemStatusQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await systemStatus({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: systemStatusQueryKey(options)
});

export const tracksQueryKey = (options?: Options<TracksData>) => createQueryKey('tracks', options);

export const tracksOptions = (options?: Options<TracksData>) => queryOptions<TracksResponse, DefaultError, TracksResponse, ReturnType<typeof tracksQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await tracks({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: tracksQueryKey(options)
});

const createInfiniteParams = <K extends Pick<QueryKey<Options>[0], 'body' | 'headers' | 'path' | 'query'>>(queryKey: QueryKey<Options>, page: K) => {
    const params = { ...queryKey[0] };
    if (page.body) {
        params.body = {
            ...queryKey[0].body as any,
            ...page.body as any
        };
    }
    if (page.headers) {
        params.headers = {
            ...queryKey[0].headers,
            ...page.headers
        };
    }
    if (page.path) {
        params.path = {
            ...queryKey[0].path as any,
            ...page.path as any
        };
    }
    if (page.query) {
        params.query = {
            ...queryKey[0].query as any,
            ...page.query as any
        };
    }
    return params as unknown as typeof page;
};

export const tracksInfiniteQueryKey = (options?: Options<TracksData>): QueryKey<Options<TracksData>> => createQueryKey('tracks', options, true);

export const spotifySearchQueryKey = (options?: Options<SpotifySearchData>) => createQueryKey('spotifySearch', options);

export const spotifySearchOptions = (options?: Options<SpotifySearchData>) => queryOptions<SpotifySearchResponse, DefaultError, SpotifySearchResponse, ReturnType<typeof spotifySearchQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await spotifySearch({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: spotifySearchQueryKey(options)
});

export const trackQueryKey = (options: Options<TrackData>) => createQueryKey('track', options);

export const trackOptions = (options: Options<TrackData>) => queryOptions<TrackResponse, DefaultError, TrackResponse, ReturnType<typeof trackQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await track({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: trackQueryKey(options)
});

export const favoritesQueryKey = (options?: Options<FavoritesData>) => createQueryKey('favorites', options);

export const favoritesOptions = (options?: Options<FavoritesData>) => queryOptions<FavoritesResponse, DefaultError, FavoritesResponse, ReturnType<typeof favoritesQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await favorites({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: favoritesQueryKey(options)
});

export const addFavoriteMutation = (options?: Partial<Options<AddFavoriteData>>): UseMutationOptions<AddFavoriteResponse, DefaultError, Options<AddFavoriteData>> => {
    const mutationOptions: UseMutationOptions<AddFavoriteResponse, DefaultError, Options<AddFavoriteData>> = {
        mutationFn: async (fnOptions) => await addFavorite({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const removeFavoriteMutation = (options?: Partial<Options<RemoveFavoriteData>>): UseMutationOptions<RemoveFavoriteResponse, DefaultError, Options<RemoveFavoriteData>> => {
    const mutationOptions: UseMutationOptions<RemoveFavoriteResponse, DefaultError, Options<RemoveFavoriteData>> = {
        mutationFn: async (fnOptions) => await removeFavorite({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const queueForBreakQueryKey = (options: Options<QueueForBreakData>) => createQueryKey('queueForBreak', options);

export const queueForBreakOptions = (options: Options<QueueForBreakData>) => queryOptions<QueueForBreakResponse, DefaultError, QueueForBreakResponse, ReturnType<typeof queueForBreakQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await queueForBreak({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: queueForBreakQueryKey(options)
});

export const proposeMutation = (options?: Partial<Options<ProposeData>>): UseMutationOptions<ProposeResponse, DefaultError, Options<ProposeData>> => {
    const mutationOptions: UseMutationOptions<ProposeResponse, DefaultError, Options<ProposeData>> = {
        mutationFn: async (fnOptions) => await propose({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const voteMutation = (options?: Partial<Options<VoteData>>): UseMutationOptions<VoteResponse, DefaultError, Options<VoteData>> => {
    const mutationOptions: UseMutationOptions<VoteResponse, DefaultError, Options<VoteData>> = {
        mutationFn: async (fnOptions) => await vote({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const undoVoteMutation = (options?: Partial<Options<UndoVoteData>>): UseMutationOptions<UndoVoteResponse, DefaultError, Options<UndoVoteData>> => {
    const mutationOptions: UseMutationOptions<UndoVoteResponse, DefaultError, Options<UndoVoteData>> = {
        mutationFn: async (fnOptions) => await undoVote({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const archiveMutation = (options?: Partial<Options<ArchiveData>>): UseMutationOptions<ArchiveResponse, DefaultError, Options<ArchiveData>> => {
    const mutationOptions: UseMutationOptions<ArchiveResponse, DefaultError, Options<ArchiveData>> = {
        mutationFn: async (fnOptions) => await archive({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const reorderQueueMutation = (options?: Partial<Options<ReorderQueueData>>): UseMutationOptions<ReorderQueueResponse, DefaultError, Options<ReorderQueueData>> => {
    const mutationOptions: UseMutationOptions<ReorderQueueResponse, DefaultError, Options<ReorderQueueData>> = {
        mutationFn: async (fnOptions) => await reorderQueue({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const breaksQueryKey = (options?: Options<BreaksData>) => createQueryKey('breaks', options);

export const breaksOptions = (options?: Options<BreaksData>) => queryOptions<BreaksResponse, DefaultError, BreaksResponse, ReturnType<typeof breaksQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await breaks({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: breaksQueryKey(options)
});

export const calendarQueryKey = (options?: Options<CalendarData>) => createQueryKey('calendar', options);

export const calendarOptions = (options?: Options<CalendarData>) => queryOptions<CalendarResponse, DefaultError, CalendarResponse, ReturnType<typeof calendarQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await calendar({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: calendarQueryKey(options)
});

export const songsRankingQueryKey = (options?: Options<SongsRankingData>) => createQueryKey('songsRanking', options);

export const songsRankingOptions = (options?: Options<SongsRankingData>) => queryOptions<SongsRankingResponse, DefaultError, SongsRankingResponse, ReturnType<typeof songsRankingQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await songsRanking({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: songsRankingQueryKey(options)
});

export const artistsRankingQueryKey = (options?: Options<ArtistsRankingData>) => createQueryKey('artistsRanking', options);

export const artistsRankingOptions = (options?: Options<ArtistsRankingData>) => queryOptions<ArtistsRankingResponse, DefaultError, ArtistsRankingResponse, ReturnType<typeof artistsRankingQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await artistsRanking({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: artistsRankingQueryKey(options)
});

export const playbackHistoryQueryKey = (options?: Options<PlaybackHistoryData>) => createQueryKey('playbackHistory', options);

export const playbackHistoryOptions = (options?: Options<PlaybackHistoryData>) => queryOptions<PlaybackHistoryResponse, DefaultError, PlaybackHistoryResponse, ReturnType<typeof playbackHistoryQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await playbackHistory({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: playbackHistoryQueryKey(options)
});

export const playbackHistoryInfiniteQueryKey = (options?: Options<PlaybackHistoryData>): QueryKey<Options<PlaybackHistoryData>> => createQueryKey('playbackHistory', options, true);

export const pendingQueryKey = (options?: Options<PendingData>) => createQueryKey('pending', options);

export const pendingOptions = (options?: Options<PendingData>) => queryOptions<PendingResponse, DefaultError, PendingResponse, ReturnType<typeof pendingQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await pending({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: pendingQueryKey(options)
});

export const approveMutation = (options?: Partial<Options<ApproveData>>): UseMutationOptions<ApproveResponse, DefaultError, Options<ApproveData>> => {
    const mutationOptions: UseMutationOptions<ApproveResponse, DefaultError, Options<ApproveData>> = {
        mutationFn: async (fnOptions) => await approve({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const denyMutation = (options?: Partial<Options<DenyData>>): UseMutationOptions<DenyResponse, DefaultError, Options<DenyData>> => {
    const mutationOptions: UseMutationOptions<DenyResponse, DefaultError, Options<DenyData>> = {
        mutationFn: async (fnOptions) => await deny({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const bansQueryKey = (options?: Options<BansData>) => createQueryKey('bans', options);

export const bansOptions = (options?: Options<BansData>) => queryOptions<BansResponse, DefaultError, BansResponse, ReturnType<typeof bansQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await bans({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: bansQueryKey(options)
});

export const banMutation = (options?: Partial<Options<BanData>>): UseMutationOptions<BanResponse, DefaultError, Options<BanData>> => {
    const mutationOptions: UseMutationOptions<BanResponse, DefaultError, Options<BanData>> = {
        mutationFn: async (fnOptions) => await ban({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const liftBanMutation = (options?: Partial<Options<LiftBanData>>): UseMutationOptions<LiftBanResponse, DefaultError, Options<LiftBanData>> => {
    const mutationOptions: UseMutationOptions<LiftBanResponse, DefaultError, Options<LiftBanData>> = {
        mutationFn: async (fnOptions) => await liftBan({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const songBlacklistQueryKey = (options?: Options<SongBlacklistData>) => createQueryKey('songBlacklist', options);

export const songBlacklistOptions = (options?: Options<SongBlacklistData>) => queryOptions<SongBlacklistResponse, DefaultError, SongBlacklistResponse, ReturnType<typeof songBlacklistQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await songBlacklist({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: songBlacklistQueryKey(options)
});

export const songBlacklistInfiniteQueryKey = (options?: Options<SongBlacklistData>): QueryKey<Options<SongBlacklistData>> => createQueryKey('songBlacklist', options, true);

export const blacklistSongMutation = (options?: Partial<Options<BlacklistSongData>>): UseMutationOptions<BlacklistSongResponse, DefaultError, Options<BlacklistSongData>> => {
    const mutationOptions: UseMutationOptions<BlacklistSongResponse, DefaultError, Options<BlacklistSongData>> = {
        mutationFn: async (fnOptions) => await blacklistSong({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const removeBlacklistedSongMutation = (options?: Partial<Options<RemoveBlacklistedSongData>>): UseMutationOptions<RemoveBlacklistedSongResponse, DefaultError, Options<RemoveBlacklistedSongData>> => {
    const mutationOptions: UseMutationOptions<RemoveBlacklistedSongResponse, DefaultError, Options<RemoveBlacklistedSongData>> = {
        mutationFn: async (fnOptions) => await removeBlacklistedSong({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const artistBlacklistQueryKey = (options?: Options<ArtistBlacklistData>) => createQueryKey('artistBlacklist', options);

export const artistBlacklistOptions = (options?: Options<ArtistBlacklistData>) => queryOptions<ArtistBlacklistResponse, DefaultError, ArtistBlacklistResponse, ReturnType<typeof artistBlacklistQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await artistBlacklist({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: artistBlacklistQueryKey(options)
});

export const artistBlacklistInfiniteQueryKey = (options?: Options<ArtistBlacklistData>): QueryKey<Options<ArtistBlacklistData>> => createQueryKey('artistBlacklist', options, true);

export const removeBlacklistedArtistMutation = (options?: Partial<Options<RemoveBlacklistedArtistData>>): UseMutationOptions<RemoveBlacklistedArtistResponse, DefaultError, Options<RemoveBlacklistedArtistData>> => {
    const mutationOptions: UseMutationOptions<RemoveBlacklistedArtistResponse, DefaultError, Options<RemoveBlacklistedArtistData>> = {
        mutationFn: async (fnOptions) => await removeBlacklistedArtist({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const blacklistArtistMutation = (options?: Partial<Options<BlacklistArtistData>>): UseMutationOptions<BlacklistArtistResponse, DefaultError, Options<BlacklistArtistData>> => {
    const mutationOptions: UseMutationOptions<BlacklistArtistResponse, DefaultError, Options<BlacklistArtistData>> = {
        mutationFn: async (fnOptions) => await blacklistArtist({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const greenlistQueryKey = (options?: Options<GreenlistData>) => createQueryKey('greenlist', options);

export const greenlistOptions = (options?: Options<GreenlistData>) => queryOptions<GreenlistResponse, DefaultError, GreenlistResponse, ReturnType<typeof greenlistQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await greenlist({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: greenlistQueryKey(options)
});

export const greenlistInfiniteQueryKey = (options?: Options<GreenlistData>): QueryKey<Options<GreenlistData>> => createQueryKey('greenlist', options, true);

export const greenlistSongMutation = (options?: Partial<Options<GreenlistSongData>>): UseMutationOptions<GreenlistSongResponse, DefaultError, Options<GreenlistSongData>> => {
    const mutationOptions: UseMutationOptions<GreenlistSongResponse, DefaultError, Options<GreenlistSongData>> = {
        mutationFn: async (fnOptions) => await greenlistSong({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const removeGreenlistedSongMutation = (options?: Partial<Options<RemoveGreenlistedSongData>>): UseMutationOptions<RemoveGreenlistedSongResponse, DefaultError, Options<RemoveGreenlistedSongData>> => {
    const mutationOptions: UseMutationOptions<RemoveGreenlistedSongResponse, DefaultError, Options<RemoveGreenlistedSongData>> = {
        mutationFn: async (fnOptions) => await removeGreenlistedSong({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const playerStatusQueryKey = (options?: Options<PlayerStatusData>) => createQueryKey('playerStatus', options);

export const playerStatusOptions = (options?: Options<PlayerStatusData>) => queryOptions<PlayerStatusResponse, DefaultError, PlayerStatusResponse, ReturnType<typeof playerStatusQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await playerStatus({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: playerStatusQueryKey(options)
});

export const setVolumeMutation = (options?: Partial<Options<SetVolumeData>>): UseMutationOptions<SetVolumeResponse, DefaultError, Options<SetVolumeData>> => {
    const mutationOptions: UseMutationOptions<SetVolumeResponse, DefaultError, Options<SetVolumeData>> = {
        mutationFn: async (fnOptions) => await setVolume({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const pausePlayerMutation = (options?: Partial<Options<PausePlayerData>>): UseMutationOptions<PausePlayerResponse, DefaultError, Options<PausePlayerData>> => {
    const mutationOptions: UseMutationOptions<PausePlayerResponse, DefaultError, Options<PausePlayerData>> = {
        mutationFn: async (fnOptions) => await pausePlayer({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const resumePlayerMutation = (options?: Partial<Options<ResumePlayerData>>): UseMutationOptions<ResumePlayerResponse, DefaultError, Options<ResumePlayerData>> => {
    const mutationOptions: UseMutationOptions<ResumePlayerResponse, DefaultError, Options<ResumePlayerData>> = {
        mutationFn: async (fnOptions) => await resumePlayer({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const stopPlayerMutation = (options?: Partial<Options<StopPlayerData>>): UseMutationOptions<StopPlayerResponse, DefaultError, Options<StopPlayerData>> => {
    const mutationOptions: UseMutationOptions<StopPlayerResponse, DefaultError, Options<StopPlayerData>> = {
        mutationFn: async (fnOptions) => await stopPlayer({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const mutePlayerMutation = (options?: Partial<Options<MutePlayerData>>): UseMutationOptions<MutePlayerResponse, DefaultError, Options<MutePlayerData>> => {
    const mutationOptions: UseMutationOptions<MutePlayerResponse, DefaultError, Options<MutePlayerData>> = {
        mutationFn: async (fnOptions) => await mutePlayer({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const skipTrackMutation = (options?: Partial<Options<SkipTrackData>>): UseMutationOptions<SkipTrackResponse, DefaultError, Options<SkipTrackData>> => {
    const mutationOptions: UseMutationOptions<SkipTrackResponse, DefaultError, Options<SkipTrackData>> = {
        mutationFn: async (fnOptions) => await skipTrack({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const playFileMutation = (options?: Partial<Options<PlayFileData>>): UseMutationOptions<PlayFileResponse, DefaultError, Options<PlayFileData>> => {
    const mutationOptions: UseMutationOptions<PlayFileResponse, DefaultError, Options<PlayFileData>> = {
        mutationFn: async (fnOptions) => await playFile({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const uploadAndPlayMutation = (options?: Partial<Options<UploadAndPlayData>>): UseMutationOptions<UploadAndPlayResponse, DefaultError, Options<UploadAndPlayData>> => {
    const mutationOptions: UseMutationOptions<UploadAndPlayResponse, DefaultError, Options<UploadAndPlayData>> = {
        mutationFn: async (fnOptions) => await uploadAndPlay({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const dashboardQueryKey = (options?: Options<DashboardData>) => createQueryKey('dashboard', options);

export const dashboardOptions = (options?: Options<DashboardData>) => queryOptions<DashboardResponse, DefaultError, DashboardResponse, ReturnType<typeof dashboardQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await dashboard({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: dashboardQueryKey(options)
});

export const usersQueryKey = (options?: Options<UsersData>) => createQueryKey('users', options);

export const usersOptions = (options?: Options<UsersData>) => queryOptions<UsersResponse, DefaultError, UsersResponse, ReturnType<typeof usersQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await users({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: usersQueryKey(options)
});

export const usersInfiniteQueryKey = (options?: Options<UsersData>): QueryKey<Options<UsersData>> => createQueryKey('users', options, true);

export const updateRoleMutation = (options?: Partial<Options<UpdateRoleData>>): UseMutationOptions<UpdateRoleResponse, DefaultError, Options<UpdateRoleData>> => {
    const mutationOptions: UseMutationOptions<UpdateRoleResponse, DefaultError, Options<UpdateRoleData>> = {
        mutationFn: async (fnOptions) => await updateRole({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const weeklyQueryKey = (options?: Options<WeeklyData>) => createQueryKey('weekly', options);

export const weeklyOptions = (options?: Options<WeeklyData>) => queryOptions<WeeklyResponse, DefaultError, WeeklyResponse, ReturnType<typeof weeklyQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await weekly({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: weeklyQueryKey(options)
});

export const updateWeekdayMutation = (options?: Partial<Options<UpdateWeekdayData>>): UseMutationOptions<UpdateWeekdayResponse, DefaultError, Options<UpdateWeekdayData>> => {
    const mutationOptions: UseMutationOptions<UpdateWeekdayResponse, DefaultError, Options<UpdateWeekdayData>> = {
        mutationFn: async (fnOptions) => await updateWeekday({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const weeklyBreaksQueryKey = (options: Options<WeeklyBreaksData>) => createQueryKey('weeklyBreaks', options);

export const weeklyBreaksOptions = (options: Options<WeeklyBreaksData>) => queryOptions<WeeklyBreaksResponse, DefaultError, WeeklyBreaksResponse, ReturnType<typeof weeklyBreaksQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await weeklyBreaks({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: weeklyBreaksQueryKey(options)
});

export const updateWeeklyBreakMutation = (options?: Partial<Options<UpdateWeeklyBreakData>>): UseMutationOptions<UpdateWeeklyBreakResponse, DefaultError, Options<UpdateWeeklyBreakData>> => {
    const mutationOptions: UseMutationOptions<UpdateWeeklyBreakResponse, DefaultError, Options<UpdateWeeklyBreakData>> = {
        mutationFn: async (fnOptions) => await updateWeeklyBreak({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const templatesQueryKey = (options?: Options<TemplatesData>) => createQueryKey('templates', options);

export const templatesOptions = (options?: Options<TemplatesData>) => queryOptions<TemplatesResponse, DefaultError, TemplatesResponse, ReturnType<typeof templatesQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await templates({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: templatesQueryKey(options)
});

export const createTemplateMutation = (options?: Partial<Options<CreateTemplateData>>): UseMutationOptions<CreateTemplateResponse, DefaultError, Options<CreateTemplateData>> => {
    const mutationOptions: UseMutationOptions<CreateTemplateResponse, DefaultError, Options<CreateTemplateData>> = {
        mutationFn: async (fnOptions) => await createTemplate({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const deleteTemplateMutation = (options?: Partial<Options<DeleteTemplateData>>): UseMutationOptions<DeleteTemplateResponse, DefaultError, Options<DeleteTemplateData>> => {
    const mutationOptions: UseMutationOptions<DeleteTemplateResponse, DefaultError, Options<DeleteTemplateData>> = {
        mutationFn: async (fnOptions) => await deleteTemplate({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const updateTemplateMutation = (options?: Partial<Options<UpdateTemplateData>>): UseMutationOptions<UpdateTemplateResponse, DefaultError, Options<UpdateTemplateData>> => {
    const mutationOptions: UseMutationOptions<UpdateTemplateResponse, DefaultError, Options<UpdateTemplateData>> = {
        mutationFn: async (fnOptions) => await updateTemplate({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const updateBaseBreaksMutation = (options?: Partial<Options<UpdateBaseBreaksData>>): UseMutationOptions<UpdateBaseBreaksResponse, DefaultError, Options<UpdateBaseBreaksData>> => {
    const mutationOptions: UseMutationOptions<UpdateBaseBreaksResponse, DefaultError, Options<UpdateBaseBreaksData>> = {
        mutationFn: async (fnOptions) => await updateBaseBreaks({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const exceptionDaysQueryKey = (options?: Options<ExceptionDaysData>) => createQueryKey('exceptionDays', options);

export const exceptionDaysOptions = (options?: Options<ExceptionDaysData>) => queryOptions<ExceptionDaysResponse, DefaultError, ExceptionDaysResponse, ReturnType<typeof exceptionDaysQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await exceptionDays({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: exceptionDaysQueryKey(options)
});

export const createExceptionDayMutation = (options?: Partial<Options<CreateExceptionDayData>>): UseMutationOptions<CreateExceptionDayResponse, DefaultError, Options<CreateExceptionDayData>> => {
    const mutationOptions: UseMutationOptions<CreateExceptionDayResponse, DefaultError, Options<CreateExceptionDayData>> = {
        mutationFn: async (fnOptions) => await createExceptionDay({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const deleteExceptionDayMutation = (options?: Partial<Options<DeleteExceptionDayData>>): UseMutationOptions<DeleteExceptionDayResponse, DefaultError, Options<DeleteExceptionDayData>> => {
    const mutationOptions: UseMutationOptions<DeleteExceptionDayResponse, DefaultError, Options<DeleteExceptionDayData>> = {
        mutationFn: async (fnOptions) => await deleteExceptionDay({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const exceptionBreaksQueryKey = (options?: Options<ExceptionBreaksData>) => createQueryKey('exceptionBreaks', options);

export const exceptionBreaksOptions = (options?: Options<ExceptionBreaksData>) => queryOptions<ExceptionBreaksResponse, DefaultError, ExceptionBreaksResponse, ReturnType<typeof exceptionBreaksQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await exceptionBreaks({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: exceptionBreaksQueryKey(options)
});

export const createExceptionBreakMutation = (options?: Partial<Options<CreateExceptionBreakData>>): UseMutationOptions<CreateExceptionBreakResponse, DefaultError, Options<CreateExceptionBreakData>> => {
    const mutationOptions: UseMutationOptions<CreateExceptionBreakResponse, DefaultError, Options<CreateExceptionBreakData>> = {
        mutationFn: async (fnOptions) => await createExceptionBreak({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const deleteExceptionBreakMutation = (options?: Partial<Options<DeleteExceptionBreakData>>): UseMutationOptions<DeleteExceptionBreakResponse, DefaultError, Options<DeleteExceptionBreakData>> => {
    const mutationOptions: UseMutationOptions<DeleteExceptionBreakResponse, DefaultError, Options<DeleteExceptionBreakData>> = {
        mutationFn: async (fnOptions) => await deleteExceptionBreak({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const eventsQueryKey = (options?: Options<EventsData>) => createQueryKey('events', options);

export const eventsOptions = (options?: Options<EventsData>) => queryOptions<EventsResponse, DefaultError, EventsResponse, ReturnType<typeof eventsQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await events({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: eventsQueryKey(options)
});

export const createEventMutation = (options?: Partial<Options<CreateEventData>>): UseMutationOptions<CreateEventResponse, DefaultError, Options<CreateEventData>> => {
    const mutationOptions: UseMutationOptions<CreateEventResponse, DefaultError, Options<CreateEventData>> = {
        mutationFn: async (fnOptions) => await createEvent({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const deleteEventMutation = (options?: Partial<Options<DeleteEventData>>): UseMutationOptions<DeleteEventResponse, DefaultError, Options<DeleteEventData>> => {
    const mutationOptions: UseMutationOptions<DeleteEventResponse, DefaultError, Options<DeleteEventData>> = {
        mutationFn: async (fnOptions) => await deleteEvent({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const updateEventMutation = (options?: Partial<Options<UpdateEventData>>): UseMutationOptions<UpdateEventResponse, DefaultError, Options<UpdateEventData>> => {
    const mutationOptions: UseMutationOptions<UpdateEventResponse, DefaultError, Options<UpdateEventData>> = {
        mutationFn: async (fnOptions) => await updateEvent({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const fallbackTracksQueryKey = (options?: Options<FallbackTracksData>) => createQueryKey('fallbackTracks', options);

export const fallbackTracksOptions = (options?: Options<FallbackTracksData>) => queryOptions<FallbackTracksResponse, DefaultError, FallbackTracksResponse, ReturnType<typeof fallbackTracksQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await fallbackTracks({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: fallbackTracksQueryKey(options)
});

export const addFallbackTrackMutation = (options?: Partial<Options<AddFallbackTrackData>>): UseMutationOptions<AddFallbackTrackResponse, DefaultError, Options<AddFallbackTrackData>> => {
    const mutationOptions: UseMutationOptions<AddFallbackTrackResponse, DefaultError, Options<AddFallbackTrackData>> = {
        mutationFn: async (fnOptions) => await addFallbackTrack({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const removeFallbackTrackMutation = (options?: Partial<Options<RemoveFallbackTrackData>>): UseMutationOptions<RemoveFallbackTrackResponse, DefaultError, Options<RemoveFallbackTrackData>> => {
    const mutationOptions: UseMutationOptions<RemoveFallbackTrackResponse, DefaultError, Options<RemoveFallbackTrackData>> = {
        mutationFn: async (fnOptions) => await removeFallbackTrack({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const adminTracksQueryKey = (options?: Options<AdminTracksData>) => createQueryKey('adminTracks', options);

export const adminTracksOptions = (options?: Options<AdminTracksData>) => queryOptions<AdminTracksResponse, DefaultError, AdminTracksResponse, ReturnType<typeof adminTracksQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await adminTracks({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: adminTracksQueryKey(options)
});

export const adminTracksInfiniteQueryKey = (options?: Options<AdminTracksData>): QueryKey<Options<AdminTracksData>> => createQueryKey('adminTracks', options, true);

export const createTrackMutation = (options?: Partial<Options<CreateTrackData>>): UseMutationOptions<CreateTrackResponse, DefaultError, Options<CreateTrackData>> => {
    const mutationOptions: UseMutationOptions<CreateTrackResponse, DefaultError, Options<CreateTrackData>> = {
        mutationFn: async (fnOptions) => await createTrack({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const deleteTrackMutation = (options?: Partial<Options<DeleteTrackData>>): UseMutationOptions<DeleteTrackResponse, DefaultError, Options<DeleteTrackData>> => {
    const mutationOptions: UseMutationOptions<DeleteTrackResponse, DefaultError, Options<DeleteTrackData>> = {
        mutationFn: async (fnOptions) => await deleteTrack({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const adminTrackQueryKey = (options: Options<AdminTrackData>) => createQueryKey('adminTrack', options);

export const adminTrackOptions = (options: Options<AdminTrackData>) => queryOptions<AdminTrackResponse, DefaultError, AdminTrackResponse, ReturnType<typeof adminTrackQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await adminTrack({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: adminTrackQueryKey(options)
});

export const updateTrackMutation = (options?: Partial<Options<UpdateTrackData>>): UseMutationOptions<UpdateTrackResponse, DefaultError, Options<UpdateTrackData>> => {
    const mutationOptions: UseMutationOptions<UpdateTrackResponse, DefaultError, Options<UpdateTrackData>> = {
        mutationFn: async (fnOptions) => await updateTrack({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const restoreTrackMutation = (options?: Partial<Options<RestoreTrackData>>): UseMutationOptions<RestoreTrackResponse, DefaultError, Options<RestoreTrackData>> => {
    const mutationOptions: UseMutationOptions<RestoreTrackResponse, DefaultError, Options<RestoreTrackData>> = {
        mutationFn: async (fnOptions) => await restoreTrack({
            ...options,
            ...fnOptions,
            throwOnError: true
        })
    };
    return mutationOptions;
};

export const spotifyStatusQueryKey = (options?: Options<SpotifyStatusData>) => createQueryKey('spotifyStatus', options);

export const spotifyStatusOptions = (options?: Options<SpotifyStatusData>) => queryOptions<SpotifyStatusResponse, DefaultError, SpotifyStatusResponse, ReturnType<typeof spotifyStatusQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await spotifyStatus({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: spotifyStatusQueryKey(options)
});

export const spotifyConnectQueryKey = (options?: Options<SpotifyConnectData>) => createQueryKey('spotifyConnect', options);

export const spotifyConnectOptions = (options?: Options<SpotifyConnectData>) => queryOptions<unknown, DefaultError, unknown, ReturnType<typeof spotifyConnectQueryKey>>({
    queryFn: async ({ queryKey, signal }) => await spotifyConnect({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true
    }),
    queryKey: spotifyConnectQueryKey(options)
});
