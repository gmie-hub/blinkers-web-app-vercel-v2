import styles from './index.module.scss';
import { Image } from "antd";
import Card from '@/components/ui/card/card';
import Button from '@/components/ui/button/button';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';

const PasswordResetSuccessful = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(routes.auth.login);
  };

  return (
    <section className={styles.container}>
      <Card style={styles.card}>
        <Image  className={styles.iconContainer} src='/Done.svg' alt={'DoneIcon'} preview={false} />

        <div className={styles.successfulText}>
          <p>Password Reset Successfully</p>
          <p>You have successfully reset your password.You can now log in with,</p>
          <p> your new password</p>
        </div>

        <Button type="submit" text="Log In" onClick={handleNavigate} />
      </Card>
    </section>
  );
};

export default PasswordResetSuccessful;
