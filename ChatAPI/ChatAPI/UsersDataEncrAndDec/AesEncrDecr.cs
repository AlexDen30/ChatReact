using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.IO;

namespace ChatAPI.UsersDataEncrAndDec
{
    public class AesEncrDecr
    {

        
        public static byte[] EncryptStringToBytes_Aes(string plainText, byte[] Key , byte[] IV )
        {
            
            byte[] encrypted;

            using (Aes aesAlg = Aes.Create())
            {
                
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(Key, IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

    
            return encrypted;
        }

        public static string DecryptStringFromBytes_Aes(byte[] cipherText, byte[] Key, byte[] IV)
        {
            
            string plaintext = null;

            using (Aes aesAlg = Aes.Create())
            {
                
                
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(Key, IV);

                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }
    }
}
