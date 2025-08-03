
export class ProfileDto {
  id: string;
  name: string;
  lastname: string;
  email: string;
  profile?: {
    profile_picture?: string | null;
    birthdate: Date;
    phone: string;
    country: string;
    province: string;
    city: string;
  };
}
