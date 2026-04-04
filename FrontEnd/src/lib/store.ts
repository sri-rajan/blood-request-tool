export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";
export type RequestStatus = "pending" | "approved" | "rejected" | "processed";

export interface BloodRequest {
  id: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  patientName: string;
  reason: string;
  requiredTiming: string;
  attenderPhone: string;
  status: RequestStatus;
  createdAt: string;
  token?: string;
}

export interface RequestLink {
  token: string;
  expiryHours: number;
  createdAt: string;
  expiresAt: string;
  requestId?: string;
}

// In-memory store (in a real app, this would be a backend database)
let requests: BloodRequest[] = [
  {
    id: "1",
    bloodGroup: "O+",
    hospitalName: "City General Hospital",
    patientName: "Rajesh Kumar",
    reason: "Emergency surgery - road accident",
    requiredTiming: "2026-02-08T18:00",
    attenderPhone: "+91 98765 43210",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    bloodGroup: "AB-",
    hospitalName: "St. Mary's Medical Center",
    patientName: "Priya Sharma",
    reason: "Cancer treatment - chemotherapy",
    requiredTiming: "2026-02-09T10:00",
    attenderPhone: "+91 87654 32109",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    bloodGroup: "B+",
    hospitalName: "Metro Care Hospital",
    patientName: "Amit Patel",
    reason: "Major surgery scheduled",
    requiredTiming: "2026-02-10T14:00",
    attenderPhone: "+91 76543 21098",
    status: "pending",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

let links: RequestLink[] = [];

export const store = {
  // Request management
  getRequests: (): BloodRequest[] => requests,

  getRequestById: (id: string): BloodRequest | undefined =>
    requests.find((r) => r.id === id),

  addRequest: (
    request: Omit<BloodRequest, "id" | "createdAt" | "status">,
  ): BloodRequest => {
    const newRequest: BloodRequest = {
      ...request,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    requests.push(newRequest);
    return newRequest;
  },

  updateRequest: (
    id: string,
    updates: Partial<BloodRequest>,
  ): BloodRequest | undefined => {
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return undefined;
    const updateData: any = { ...requests[index], ...updates };
    requests[index] = updateData;
    return requests[index];
  },

  updateRequestStatus: (
    id: string,
    status: RequestStatus,
  ): BloodRequest | undefined => {
    return store.updateRequest(id, { status });
  },

  // Link management
  generateLink: (expiryHours: number): RequestLink => {
    const token = Math.random().toString(36).substring(2, 15);
    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() + expiryHours * 60 * 60 * 1000,
    );

    const link: RequestLink = {
      token,
      expiryHours,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    links.push(link);
    return link;
  },

  validateToken: (token: string): { valid: boolean; link?: RequestLink } => {
    const link = links.find((l) => l.token === token);
    if (!link) return { valid: false };

    const now = new Date();
    const expiresAt = new Date(link.expiresAt);

    if (now > expiresAt) return { valid: false, link };
    return { valid: true, link };
  },

  linkRequest: (token: string, requestId: string): boolean => {
    const link = links.find((l) => l.token === token);
    if (!link) return false;
    link.requestId = requestId;
    return true;
  },

  getRequestByToken: (token: string): BloodRequest | undefined => {
    const link = links.find((l) => l.token === token);
    if (!link || !link.requestId) return undefined;
    return requests.find((r) => r.id === link.requestId);
  },
};

// Mock authentication
export const auth = {
  login: (email: string, password: string): boolean => {
    // Simple mock authentication
    return email === "admin@bloodrequest.com" && password === "admin123";
  },

  isAuthenticated: (): boolean => {
    return sessionStorage.getItem("authenticated") === "true";
  },

  setAuthenticated: (value: boolean): void => {
    if (value) {
      sessionStorage.setItem("authenticated", "true");
    } else {
      sessionStorage.removeItem("authenticated");
    }
  },

  logout: (): void => {
    sessionStorage.removeItem("authenticated");
  },
};
