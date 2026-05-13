import { delay, firstValueFrom, of, throwError } from "rxjs";

export type ManualPairingPayload = {
  classTitle: string;
  subject: string;
  schedule: string;
  fee: string;
  district: string;
  target: string;
  note?: string;
};

export type ConfirmPairingPayload = {
  classId: string;
  candidateId: string;
};

export type MockServiceOptions = {
  shouldFail?: boolean;
};

function simulateResponse<T>(
  data: T,
  options?: MockServiceOptions,
): Promise<T> {
  const shouldFail = options?.shouldFail ?? false;
  const response$ = shouldFail
    ? throwError(() => new Error("Mo phong loi he thong. Vui long thu lai."))
    : of(data);

  return firstValueFrom(response$.pipe(delay(500)));
}

export async function createManualPairing(
  payload: ManualPairingPayload,
  options?: MockServiceOptions,
): Promise<{ requestId: string; payload: ManualPairingPayload }> {
  const requestId = `REQ-${Date.now()}`;
  return simulateResponse({ requestId, payload }, options);
}

export async function confirmClassAssignment(
  payload: ConfirmPairingPayload,
  options?: MockServiceOptions,
): Promise<{ assignmentId: string; payload: ConfirmPairingPayload }> {
  const assignmentId = `ASG-${Date.now()}`;
  return simulateResponse({ assignmentId, payload }, options);
}
