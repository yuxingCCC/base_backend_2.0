import JSEncrypt from 'jsencrypt';

export default {
  publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiVpDqm3OUlg5PD6nlenP9uTWok3CxQWcb7Sab7Q72W5Wx5fo8VJjcoUhMd83izHWCO2i4MdK7ElES5r8B9PjgVoxlS4XN+k/lZ4+8XhY4xDgkFLd1weY3NK1XLMhWrynjjbuK/N8pQ/JXvAi/OAkzDfHYi7C7/2zXKNLKi7AdwQIDAQAB',

  // 公钥加密
  encryptByPublicKey(content){
    let encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(this.publicKey); // 设置 加密公钥
    let data = encryptStr.encrypt(content.toString());  // 进行加密
    return data;
  }

}
