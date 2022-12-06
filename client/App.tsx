import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import CheckoutScreen from './CheckoutScreen';

export default function App() {
  const stripePK = Constants.expoConfig.extra.stripePK;

  return (
    <StripeProvider
      publishableKey={stripePK}
      merchantIdentifier="merchant.com.example"
    >
      <CheckoutScreen />
    </StripeProvider>
  );
}
