import { NextResponse } from "next/server";

export type ApiSuccessBody<T extends Record<string, unknown>> = {
  ok: true;
  providerCalled: false;
} & T;

export type ApiErrorBody = {
  ok: false;
  error: string;
  providerCalled: false;
  dataGaps?: string[];
};

export function createApiSuccessBody<T extends Record<string, unknown>>(data: T): ApiSuccessBody<T> {
  return {
    ok: true,
    providerCalled: false,
    ...data,
  };
}

export function createApiErrorBody(error: string, dataGaps?: string[]): ApiErrorBody {
  return {
    ok: false,
    error,
    providerCalled: false,
    ...(dataGaps && dataGaps.length > 0 ? { dataGaps } : {}),
  };
}

export function apiSuccess<T extends Record<string, unknown>>(data: T, init?: ResponseInit) {
  return NextResponse.json(createApiSuccessBody(data), init);
}

export function apiError(error: string, status = 500, dataGaps?: string[]) {
  return NextResponse.json(createApiErrorBody(error, dataGaps), { status });
}

export async function loadPartialData<T>(section: string, loader: () => Promise<T>, fallback: T) {
  try {
    return {
      data: await loader(),
      gap: "",
    };
  } catch (error) {
    console.error(`${section} partial data load failed:`, error);

    return {
      data: fallback,
      gap: `${section} records could not be loaded; partial data is available.`,
    };
  }
}
