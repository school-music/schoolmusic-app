import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError, errorText, publicClient } from '@/api/client';
import * as sdk from '@/api/generated/sdk.gen';
import { useSession } from '@/session';
import { Action, Copy, Feedback, Field, IconButton, Page } from '@/ui/components';
import { useTheme } from '@/ui/theme';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const registering = mode === 'register';
  const router = useRouter();
  const { colors } = useTheme();
  const { signIn } = useSession();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [validation, setValidation] = useState('');
  const createdLogin = useRef<string | null>(null);
  const title = registering ? 'Utwórz konto' : 'Zaloguj się';

  const mutation = useMutation({
    mutationFn: async ({ name, secret, localName }: { name: string; secret: string; localName: string }) => {
      if (registering && createdLogin.current !== name) {
        await sdk.register({ client: publicClient, body: { name, password: secret }, throwOnError: true, responseStyle: 'data' });
        createdLogin.current = name;
      }
      try {
        const profile = await sdk.login({ client: publicClient, body: { name, password: secret }, throwOnError: true, responseStyle: 'data' });
        await signIn(profile, registering ? localName : undefined);
      } catch (error) {
        if (registering && createdLogin.current === name) {
          throw new Error('Konto zostało utworzone. Zaloguj się na ekranie logowania.');
        }
        if (error instanceof ApiError && (error.status === 400 || error.status === 401)) throw new Error('Sprawdź login i hasło.');
        throw error;
      }
    },
  });

  function submit() {
    if (mutation.isPending) return;
    const name = login.trim();
    setValidation('');
    mutation.reset();
    if (!name || !password.trim()) { setValidation('Podaj login i hasło.'); return; }
    if (registering) {
      if (!displayName.trim()) { setValidation('Podaj nazwę użytkownika.'); return; }
      if (name.length < 3 || password.length < 8) {
        setValidation('Login musi mieć co najmniej 3 znaki, a hasło co najmniej 8.');
        return;
      }
      if (password !== confirmation) { setValidation('Hasła muszą być identyczne.'); return; }
    }
    Keyboard.dismiss();
    mutation.mutate({ name, secret: password, localName: displayName.trim() });
  }

  return <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]}>
    <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Copy variant="title" accessibilityRole="header">{title}</Copy>
          <Copy tone="muted" style={styles.description}>{registering
            ? 'Nowe konto, bez konieczności logowania się loginem szkolnym'
            : 'Zaloguj się za pomocą loginu szkolnego lub lokalnego'}</Copy>
          <View style={styles.fields}>
            {registering ? <Field testID="display-name" placeholder="Nazwa użytkownika" value={displayName}
              onChangeText={setDisplayName} maxLength={60} autoComplete="name" /> : null}
            <Field testID="auth-login" placeholder="Login" value={login} onChangeText={setLogin}
              autoCapitalize="none" autoCorrect={false} autoComplete="username" maxLength={100} />
            <Field testID="auth-password" placeholder="Hasło" value={password} onChangeText={setPassword}
              autoCapitalize="none" secureTextEntry autoComplete={registering ? 'new-password' : 'current-password'}
              onSubmitEditing={registering ? undefined : submit} returnKeyType={registering ? 'next' : 'go'} />
            {registering ? <Field testID="password-confirmation" placeholder="Powtórz hasło" value={confirmation}
              onChangeText={setConfirmation} autoCapitalize="none" secureTextEntry autoComplete="new-password"
              onSubmitEditing={submit} returnKeyType="go" /> : null}
          </View>
          <View style={[styles.links, registering && styles.centeredLinks]}>
            {registering ? <Copy variant="small" tone="muted">Masz już konto?</Copy>
              : <Pressable accessibilityRole="link" style={styles.link} onPress={() => router.push('/recovery')}>
                <Copy variant="small" tone="muted">Zapomniałeś hasła?</Copy>
              </Pressable>}
            <Pressable accessibilityRole="link" style={styles.link} onPress={() => {
              if (registering) router.back();
              else router.push('/register');
            }}>
              <Copy variant="small" style={styles.linkText}>{registering ? 'Zaloguj się' : 'Utwórz konto'}</Copy>
            </Pressable>
          </View>
          {validation || mutation.error ? <Feedback error text={validation || errorText(mutation.error)} /> : null}
        </View>
        <Action testID="auth-submit" label={registering ? 'Zarejestruj się' : 'Zaloguj się'} onPress={submit} busy={mutation.isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

export function Recovery() {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [login, setLogin] = useState('');
  const [sent, setSent] = useState(false);
  return <Page title="Odzyskaj dostęp" leading={<IconButton name="arrow-left" label="Wstecz" onPress={() => router.back()} />}>
    <Copy>Skontaktuj się z administratorem szkolnego konta lub radiowęzła, aby odzyskać dostęp.</Copy>
    {__DEV__ ? <Action label={preview ? 'Zamknij podgląd' : 'Podgląd odzyskiwania'} kind="secondary"
      onPress={() => { setPreview(!preview); setSent(false); }} /> : null}
    {preview ? <>
      <Copy tone="muted" variant="small">Tryb demonstracyjny. Prośba pozostaje na tym ekranie.</Copy>
      <Field placeholder="Login" value={login} onChangeText={setLogin} autoCapitalize="none" />
      <Action label="Pokaż potwierdzenie" onPress={() => setSent(true)} disabled={!login.trim()} />
      {sent ? <Feedback text="Podgląd potwierdzenia prośby o odzyskanie hasła." /> : null}
    </> : null}
  </Page>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'space-between', gap: 32, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
  description: { marginTop: 12, maxWidth: 335 },
  fields: { marginTop: 40, gap: 15 },
  links: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 6, flexWrap: 'wrap' },
  centeredLinks: { justifyContent: 'center' },
  link: { minHeight: 44, justifyContent: 'center' },
  linkText: { fontWeight: '600' },
});
