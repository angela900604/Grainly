export type AspectRatio = "3:2" | "1:1" | "4:3" | "9:16";

export type Occasion = "wedding" | "travel" | "party" | "graduation" | "birthday" | "other";

export type PhotoRecord = {
  id: string;
  dataUrl: string;
  guestTokenPrefix: string;
  createdAt: number;
};

export type SpaceRecord = {
  id: string;
  inviteCode: string;
  name: string;
  description: string;
  occasion: Occasion;
  filterPreset: string;
  aspectRatio: AspectRatio;
  isPrivate: boolean;
  coverDataUrl?: string;
  hostSecret: string;
  photos: PhotoRecord[];
  createdAt: number;
};

export type SpacePublic = Omit<SpaceRecord, "hostSecret" | "photos"> & {
  photoCount: number;
};
