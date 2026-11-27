#!/usr/bin/env bash
# ==============================================================================
# Modern Flash // Docker Hub Multi-Architecture Publishing Runner
# ==============================================================================
set -euo pipefail

REPO_USER="goldlabel2027"
TARGET="${1:-all}"
VERSION="${2:-1.0.1}"
BUILDER_NAME="modern-flash-builder"

publish_image() {
  local image_name="$1"
  local dockerfile="$2"

  echo "Building and publishing ${REPO_USER}/${image_name}:${VERSION}..."
  local tag_args=("-t" "${REPO_USER}/${image_name}:${VERSION}" "-t" "${REPO_USER}/${image_name}:latest")

  docker buildx build \
    --platform linux/amd64,linux/arm64 \
    -f "${dockerfile}" \
    "${tag_args[@]}" \
    --push \
    .

  echo "Successfully published ${REPO_USER}/${image_name}:${VERSION} and :latest to Docker Hub."
}

# 1. Verify Docker daemon is responsive
if ! docker info >/dev/null 2>&1; then
  echo "Error: Docker daemon is not running." >&2
  exit 1
fi

# 2. Check Docker Hub authentication
if ! docker system info 2>&1 | grep -q "Username" && ! [ -f ~/.docker/config.json ]; then
  echo "Notice: Please ensure you are logged into Docker Hub via 'docker login'."
fi

# 3. Configure Docker Buildx multi-arch builder instance
if ! docker buildx inspect "${BUILDER_NAME}" >/dev/null 2>&1; then
  echo "Initialising buildx builder: ${BUILDER_NAME}..."
  docker buildx create --name "${BUILDER_NAME}" --driver docker-container --use
else
  docker buildx use "${BUILDER_NAME}"
fi

docker buildx inspect --bootstrap

# 4. Build and push multi-arch manifest
echo "Executing multi-platform build and push for target: ${TARGET}..."

case "${TARGET}" in
  studio)
    publish_image "modern-flash-studio" "Dockerfile"
    ;;
  web)
    publish_image "modern-flash-web" "nextjs/Dockerfile"
    ;;
  all)
    publish_image "modern-flash-studio" "Dockerfile"
    publish_image "modern-flash-web" "nextjs/Dockerfile"
    ;;
  *)
    echo "Unknown target: ${TARGET}. Valid options: studio, web, all" >&2
    exit 1
    ;;
esac
