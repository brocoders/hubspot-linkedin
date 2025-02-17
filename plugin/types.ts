export interface APIData {
  total: number;
  results: {
    id: string;
    properties: {
      company: string | null;
      createdate: string;
      email: string;
      hs_object_id: string;
      lastmodifieddate: string;
      phone: string | null;
      firstname: string;
      lastname: string;
    };
    createdAt: string;
    updatedAt: string;
    archived: boolean;
  }[];
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  linkedinUrl: string;
  jobTitle?: string;
  companyName?: string;
}

export interface Message {
    type: 'DISPLAY_PROFILE_DATA' | 'UPDATE_PROFILE';
    data?: {
      hsData: APIData
    }
} 
