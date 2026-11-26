import { View } from 'react-native';
import { isStaff } from '@/domain';
import { SectionLink } from '@/features/options/public';
import { useSession } from '@/session';
import { Page } from '@/ui/components';

export default function Options() {
  const { session } = useSession();
  return <Page title="Opcje">
    <View>
      <SectionLink section="account" />
      <SectionLink section="rankings" />
      <SectionLink section="styles" />
      <SectionLink section="information" />
      {isStaff(session?.role) ? <SectionLink section="staff" /> : null}
    </View>
  </Page>;
}
