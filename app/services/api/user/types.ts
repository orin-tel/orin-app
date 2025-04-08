export interface IUser {
  id?: string
  auth_provider?: string
  auth_provider_id?: string
  primary_email?: string
  profile_picture_url?: string
  user_description?: string
  phone_number?: string
  first_name?: string
  last_name?: string
  location?: string
  is_onboarding_complete?: boolean
  language?: string
  agent_name?: string
  agent_voice?: string
  agent_language?: string
  created_at?: Date
  updated_at?: Date
}
