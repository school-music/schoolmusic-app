FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY schoolmusic-backend/*.csproj ./schoolmusic-backend/
RUN dotnet restore schoolmusic-backend/schoolmusic-backend.csproj
COPY schoolmusic-backend/ ./schoolmusic-backend/
WORKDIR /src/schoolmusic-backend
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libvlc-dev vlc-plugin-base && rm -rf /var/lib/apt/lists/*
RUN groupadd --system --gid 10001 schoolmusic \
    && useradd --system --uid 10001 --gid schoolmusic --create-home schoolmusic \
    && install -d -o schoolmusic -g schoolmusic /app/recordings \
    && if getent group audio >/dev/null; then usermod -aG audio schoolmusic; fi
COPY --from=build --chown=10001:10001 /app/publish .
USER schoolmusic
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENTRYPOINT ["dotnet", "schoolmusic-backend.dll"]
