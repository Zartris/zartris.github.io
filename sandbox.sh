#!/bin/bash
# Launch the Claude Code dev sandbox

set -e

COMPOSE_FILE="docker-compose.dev.yml"

case "${1:-}" in
    build)
        echo "Building sandbox image..."
        docker compose -f "$COMPOSE_FILE" build
        ;;
    stop)
        echo "Stopping sandbox..."
        docker compose -f "$COMPOSE_FILE" down
        ;;
    clean)
        echo "Removing sandbox containers and volumes..."
        docker compose -f "$COMPOSE_FILE" down -v
        ;;
    *)
        echo "Starting sandbox..."
        # Build if image doesn't exist yet
        if ! docker image inspect zartris-homepage-sandbox &>/dev/null; then
            echo "Image not found, building first..."
            docker compose -f "$COMPOSE_FILE" build
        fi
        docker compose -f "$COMPOSE_FILE" run --rm sandbox bash
        ;;
esac
