import { signUpSchema, signUpValues } from '@/app/schema/singup.schema';
import { useAuth } from '@/lib/context/state/authContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useSingUpForm = () => {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      username: '',
    },
  });

  const { SignUp, isSingUp } = useAuth();

  const handleSignUp = (payload: signUpValues) => {
    SignUp(payload);
  };

  return {
    form,
    handleSignUp,
    isSingUp,
  };
};
