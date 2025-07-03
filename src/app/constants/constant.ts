import { EncryptStorage } from 'encrypt-storage';
import { environment } from 'environments/environment';
export const encryptStorage = new EncryptStorage(environment.seKey,
    {
        prefix:'djoin',
        storageType:'localStorage',
        stateManagementUse: false,
        encAlgorithm: 'AES'
    }
);

