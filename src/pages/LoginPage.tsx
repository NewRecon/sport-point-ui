import Button from '../components/Button';
import Field from '../components/Field';

const LoginPage = () => {

  const signIn = () => {
    console.log('логинимся')
  }

  const signUp = () => {
    console.log('регаемся')
  }

  const inputText = (query: string) => {
    console.log(`${query}`)
  }

  return (
    <form>
      <h1>Вход</h1>
      <Field
        label='Логин'
        placeholder='логин'
        func={inputText} />
      <Field
        label='Пароль'
        type='password'
        placeholder='пароль'
        func={inputText} />
      <Button
        text='Вход'
        func={signIn} />
      <Button
        text='Регистрация'
        func={signUp} />
    </form>
  );
};

export default LoginPage;