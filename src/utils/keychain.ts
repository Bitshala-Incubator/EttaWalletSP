import * as Keychain from 'react-native-keychain';
import Logger from './logger';

const TAG = 'storage/keychain';

interface SecureStorage {
  key: string;
  value: string;
  options?: Keychain.Options;
}

// the user cancelled error strings are OS specific
const KEYCHAIN_USER_CANCELLED_ERRORS = [
  'user canceled the operation',
  'error: code: 13, msg: cancel',
  'error: code: 10, msg: fingerprint operation canceled by the user',
];

const USER = 'ettaln';

export const BIOMETRY_VERIFICATION_DELAY = 800;

export function isUserCancelledError(error: Error) {
  return KEYCHAIN_USER_CANCELLED_ERRORS.some((userCancelledError) =>
    error.toString().toLowerCase().includes(userCancelledError)
  );
}

export const storeItem = async (
  key: string,
  value?: string,
  accessible: Keychain.ACCESSIBLE = Keychain.ACCESSIBLE.ALWAYS
) => {
  const options = {
    accessible,
  };
  try {
    const stored = await Keychain.setInternetCredentials(key, USER, value, options);
    if (stored === false) {
      throw new Error('Store item not saved');
    }

    // check that we can correctly read the keychain before proceeding
    const retrievedItem = await retrieveStoredItem(key);
    if (retrievedItem !== value) {
      await removeStoredItem(key);
      Logger.error(
        `${TAG}@storeItem`,
        `Retrieved value for key '${key}' does not match stored value`
      );
      throw new Error(`Retrieved value for key '${key}' does not match stored value`);
    }

    return stored;
  } catch (error) {
    Logger.error(TAG, 'Error storing item', error, true, value);
    throw error;
  }
};

export const retrieveStoredItem = async (key: string): Promise<string | null> => {
  try {
    const credentials = await Keychain.getInternetCredentials(key);
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  } catch (error) {
    if (!isUserCancelledError(error)) {
      // user cancelled action
      Logger.error(TAG, 'Error retrieving stored item', error, true);
    }
    throw error;
  }
};

export const removeStoredItem = async (key: string) => {
  try {
    return await Keychain.resetInternetCredentials(key);
  } catch (error) {
    Logger.error(TAG, 'Error clearing item', error, true);
    throw error;
  }
};

export const setPinInKeyChain = async (seed: string) => storeItem('pin', seed);
export const getPinFromKeyChain = async () => retrieveStoredItem('pin');
export const removePinFromKeyChain = async () => removeStoredItem('pin');

export async function storeKeychainItem({ key, value, options = {} }: SecureStorage) {
  try {
    const result = await Keychain.setGenericPassword(USER, value, {
      service: key,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      rules: Keychain.SECURITY_RULES.NONE,
      ...options,
    });
    if (result === false) {
      throw new Error('Store result false');
    }

    // check that we can correctly read the keychain before proceeding
    const retrievedResult = await retrieveStoredKeychainItem(key);
    if (retrievedResult !== value) {
      await removeStoredItem(key);
      Logger.error(
        `${TAG}@storeItem`,
        `Retrieved value for key '${key}' does not match stored value`
      );
      throw new Error(`Retrieved value for key '${key}' does not match stored value`);
    }

    return result;
  } catch (error) {
    Logger.error(TAG, 'Error storing item', error, true, value);
    throw error;
  }
}

export async function retrieveStoredKeychainItem(key: string, options: Keychain.Options = {}) {
  try {
    const item = await Keychain.getGenericPassword({
      service: key,
      ...options,
    });
    if (!item) {
      return null;
    }
    return item.password;
  } catch (error) {
    if (!isUserCancelledError(error)) {
      // triggered when biometry verification fails and user cancels the action
      Logger.error(TAG, 'Error retrieving stored item', error, true);
    }
    throw error;
  }
}

export async function removeStoredKeychainItem(key: string) {
  try {
    return Keychain.resetGenericPassword({
      service: key,
    });
  } catch (error) {
    Logger.error(TAG, 'Error clearing item', error, true);
    throw error;
  }
}

export async function listStoredKeychainItems() {
  try {
    return Keychain.getAllGenericPasswordServices();
  } catch (error) {
    Logger.error(TAG, 'Error listing items', error, true);
    throw error;
  }
}