import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/Models/ingredient.model';
import { PagedResponse } from '../shared/Models/paged-response.model';

export type IngredientsSortDir = 'asc' | 'desc';

export interface GetIngredientsOptions {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDir?: IngredientsSortDir;
}

@Injectable()
export class IngredientsService {
  private readonly baseUrl = 'https://boozeapi.com/api/v1';
  private readonly apiOrigin = 'https://boozeapi.com';

  createIngredientsResource(
    options: () => GetIngredientsOptions,
    defaultValue: PagedResponse<Ingredient> = { data: [] },
  ): HttpResourceRef<PagedResponse<Ingredient>> {
    return httpResource(
      () => this.buildIngredientsResourceRequest(options()),
      {
        parse: (raw) => this.mapIngredientsPage(raw),
        defaultValue,
      },
    );
  }

  createIngredientsAutocompleteResource(
    query: () => string | null | undefined,
    defaultValue: PagedResponse<Ingredient> = { data: [] },
  ): HttpResourceRef<PagedResponse<Ingredient>> {
    return httpResource(
      () => {
        const q = query()?.trim();
        if (!q) return undefined;
        return {
          url: `${this.baseUrl}/ingredients/autocomplete`,
          params: { q },
        };
      },
      {
        parse: (raw) => this.mapIngredientsPage(raw),
        defaultValue,
      },
    );
  }

  createIngredientByIdResource(
    id: () => number | string | null | undefined,
  ): HttpResourceRef<Ingredient | undefined> {
    return httpResource(
      () => {
        const value = id();
        if (value == null || value === '') return undefined;
        return { url: `${this.baseUrl}/ingredients/${value}` };
      },
      {
        parse: (raw) => this.mapIngredientEntity(raw),
      },
    );
  }

  private buildIngredientsResourceRequest(options?: GetIngredientsOptions) {
    return {
      url: `${this.baseUrl}/ingredients`,
      params: this.buildIngredientsResourceParams(options),
    };
  }

  private buildIngredientsResourceParams(options?: GetIngredientsOptions) {
    const params: Record<string, string | number | boolean> = {};

    if (options?.page != null) params['page'] = options.page;
    if (options?.perPage != null) params['limit'] = options.perPage;
    if (options?.search) params['search'] = options.search;

    if (options?.sortBy && options?.sortDir) {
      params['sort'] = `${options.sortBy}_${options.sortDir}`;
    }

    return params;
  }

  private mapIngredientsPage(raw: unknown): PagedResponse<Ingredient> {
    const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    const rawData = Array.isArray(source['data']) ? (source['data'] as unknown[]) : [];

    return {
      data: rawData.map((item) => this.mapIngredientEntity(item)),
      meta: source['meta'] as PagedResponse<Ingredient>['meta'],
      pagination: source['pagination'] as PagedResponse<Ingredient>['pagination'],
    };
  }

  private mapIngredientEntity(raw: unknown): Ingredient {
    const item = raw as Record<string, unknown>;
    const type = this.normalizeNone(item['type']);
    const description = this.normalizeNone(item['description']);

    return {
      id: (item['id'] as number | string) ?? '',
      name: String(item['name'] ?? ''),
      imageUrl: this.normalizeImageUrl(item['imageUrl'] ?? item['image']),
      description,
      type,
      containsAlcohol:
        typeof item['contains_alcohol'] === 'boolean'
          ? (item['contains_alcohol'] as boolean)
          : undefined,
      createdAt: item['created_at'] ? String(item['created_at']) : undefined,
      updatedAt: item['updated_at'] ? String(item['updated_at']) : undefined,
      abv:
        typeof item['abv'] === 'number'
          ? (item['abv'] as number)
          : typeof item['ABV'] === 'number'
            ? (item['ABV'] as number)
            : undefined,
    };
  }

  private normalizeImageUrl(value: unknown): string | undefined {
    if (typeof value !== 'string' || !value.trim()) return undefined;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return value.startsWith('/') ? `${this.apiOrigin}${value}` : `${this.apiOrigin}/${value}`;
  }

  private normalizeNone(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const normalized = value.trim();
    if (!normalized || normalized.toLowerCase() === 'none') return undefined;
    return normalized;
  }
}
