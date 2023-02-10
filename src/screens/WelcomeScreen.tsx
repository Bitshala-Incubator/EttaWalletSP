import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TypographyPresets, Colors, Icon, Chip } from 'etta-ui';
import { View, StyleSheet, Text } from 'react-native';
import { navigate } from '../navigation/NavigationService';
import { Screens } from '../navigation/Screens';
import { initNavigationOptions } from '../navigation/Headers';

const WelcomeScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="icon-bitcoin-circle" style={styles.appIcon} />
      </View>
      <Text style={styles.appName}>EttaWallet</Text>
      <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
      <Button
        style={styles.button}
        title={t('welcome.createNewWallet')}
        size="block"
        appearance="filled"
        onPress={() => navigate(Screens.WalletHomeScreen)}
      />
      <Button
        style={styles.button}
        title={t('welcome.restoreWallet')}
        appearance="transparent"
        size="block"
        onPress={() => navigate(Screens.RestoreWalletScreen)}
      />
      <Text style={styles.footer}>{t('welcome.footer')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  appIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 52,
  },
  iconContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.orange.base,
  },
  appName: {
    ...TypographyPresets.Header1,
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.common.black,
  },
  subtitle: {
    ...TypographyPresets.Body1,
    marginBottom: 50,
    textAlign: 'center',
    color: Colors.neutrals.light.neutral7,
  },
  button: {
    marginBottom: 10,
  },
  footer: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 'auto',
  },
});

export default WelcomeScreen;

WelcomeScreen.navigationOptions = {
  ...initNavigationOptions,
  headerRight: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useTranslation();
    return <Chip>{t('selectLanguage')}</Chip>;
  },
};