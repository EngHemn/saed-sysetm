import { Need } from "../entities/Need";
import { NeedInput } from "../schemas/need";

export interface FindNeedsOptions {
  search?: string;
  priority?: string;
  page?: number;
  perPage?: number;
}

export interface FindNeedsResult {
  needs: Need[];
  total: number;
}

export interface INeedRepository {
  findAll(options?: FindNeedsOptions): Promise<FindNeedsResult>;
  findById(id: string): Promise<Need | null>;
  create(data: NeedInput): Promise<Need>;
  update(id: string, data: NeedInput): Promise<Need>;
  delete(id: string): Promise<Need>;
}
