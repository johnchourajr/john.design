import Room from '@/components/experimental/canvas';
import { Provider } from '@/components/experimental/canvas/provider';

export default function Page() {
  return (
    <Provider>
      <Room />;
    </Provider>
  );
}
