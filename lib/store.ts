import type { AspectRatio, Occasion, PhotoRecord, SpaceRecord } from "./types";
import { randomInviteCode } from "./codes";

declare global {
  // eslint-disable-next-line no-var
  var __grainlyStore: GrainlyStore | undefined;
}

type UploadEntry = { count: number; windowStart: number };

const WINDOW_MS = 60 * 60 * 1000;
const MAX_UPLOADS_PER_HOUR = 30;

class GrainlyStore {
  private spacesByCode = new Map<string, SpaceRecord>();
  private uploadCounts = new Map<string, UploadEntry>();

  createSpace(input: {
    name: string;
    description: string;
    occasion: Occasion;
    filterPreset: string;
    aspectRatio: AspectRatio;
    isPrivate: boolean;
    coverDataUrl?: string;
  }): SpaceRecord {
    let code = randomInviteCode(6);
    while (this.spacesByCode.has(code)) {
      code = randomInviteCode(6);
    }
    const space: SpaceRecord = {
      id: crypto.randomUUID(),
      inviteCode: code,
      name: input.name.trim() || "未命名空間",
      description: input.description.trim(),
      occasion: input.occasion,
      filterPreset: input.filterPreset,
      aspectRatio: input.aspectRatio,
      isPrivate: input.isPrivate,
      coverDataUrl: input.coverDataUrl,
      hostSecret: crypto.randomUUID(),
      photos: [],
      createdAt: Date.now(),
    };
    this.spacesByCode.set(code, space);
    return space;
  }

  getByCode(code: string): SpaceRecord | undefined {
    return this.spacesByCode.get(code.trim().toUpperCase());
  }

  assertGuestRate(guestToken: string): { ok: true } | { ok: false; message: string } {
    const key = guestToken.slice(0, 32);
    const now = Date.now();
    let e = this.uploadCounts.get(key);
    if (!e || now - e.windowStart > WINDOW_MS) {
      e = { count: 0, windowStart: now };
      this.uploadCounts.set(key, e);
    }
    if (e.count >= MAX_UPLOADS_PER_HOUR) {
      return { ok: false, message: "此裝置上傳過於頻繁，請稍後再試。" };
    }
    return { ok: true };
  }

  bumpGuestUpload(guestToken: string) {
    const key = guestToken.slice(0, 32);
    const e = this.uploadCounts.get(key);
    if (e) e.count += 1;
  }

  addPhoto(code: string, guestToken: string, dataUrl: string): PhotoRecord | undefined {
    const space = this.getByCode(code);
    if (!space) return undefined;
    const rate = this.assertGuestRate(guestToken);
    if (!rate.ok) throw new Error(rate.message);
    const photo: PhotoRecord = {
      id: crypto.randomUUID(),
      dataUrl,
      guestTokenPrefix: guestToken.slice(0, 4).toUpperCase(),
      createdAt: Date.now(),
    };
    space.photos.unshift(photo);
    this.bumpGuestUpload(guestToken);
    return photo;
  }

  deletePhoto(code: string, photoId: string, hostSecret: string): boolean {
    const space = this.getByCode(code);
    if (!space || space.hostSecret !== hostSecret) return false;
    const i = space.photos.findIndex((p) => p.id === photoId);
    if (i === -1) return false;
    space.photos.splice(i, 1);
    return true;
  }

  toPublic(space: SpaceRecord) {
    return {
      id: space.id,
      inviteCode: space.inviteCode,
      name: space.name,
      description: space.description,
      occasion: space.occasion,
      filterPreset: space.filterPreset,
      aspectRatio: space.aspectRatio,
      isPrivate: space.isPrivate,
      coverDataUrl: space.coverDataUrl,
      createdAt: space.createdAt,
      photoCount: space.photos.length,
    };
  }

  listPhotos(code: string): PhotoRecord[] {
    return [...(this.getByCode(code)?.photos ?? [])];
  }
}

export function getStore(): GrainlyStore {
  if (!globalThis.__grainlyStore) {
    globalThis.__grainlyStore = new GrainlyStore();
  }
  return globalThis.__grainlyStore;
}
