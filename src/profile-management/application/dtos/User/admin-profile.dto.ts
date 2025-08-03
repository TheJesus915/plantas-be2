export class AdminProfileDto {
  id: string;
  name: string;
  lastname: string;
  email: string;
  type: string;
  role: string;
  profile?: {
    profile_picture?: string | null;
    birthdate: Date;
    phone: string;
    country: string;
    province: string;
    city: string;
  };
  modules: {
    name: string;
    permissions: string[];
  }[];
}
