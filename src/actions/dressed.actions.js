import { utils as ethersUtils } from 'ethers';
import { getMonaTokenContract } from '@services/contract.service';
import { getMonaContractAddressByChainId } from '@services/network.service';
import { convertToWei } from '@helpers/price.helpers';
import api from '@services/api/espa/api.service';

const address = '0x3Cc6Bc27c36d23Ed95289BAF5b0bcB8538D1467c';
const ethAddress = '0x981b2cfe8c29757c1d5e5862b6f268b9792ffa32';

class DressedActions {
  async isApproved(wallet, chainId) {
    const monaContractAddress = getMonaContractAddressByChainId(chainId);
    const contract = await getMonaTokenContract(monaContractAddress);
    try {
      const allowance = await contract.methods.allowance(wallet, address).call({ from: wallet });
      const jsAllowedValue = parseFloat(ethersUtils.formatEther(allowance));
      if (jsAllowedValue < 10000000000) {
        return false;
      }
      return true;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async approveMona(wallet, chainId) {
    const monaContractAddress = getMonaContractAddressByChainId(chainId);
    const contract = await getMonaTokenContract(monaContractAddress);
    try {
      await contract.methods.approve(address, convertToWei(20000000000)).send({ from: wallet });
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async sendMona(wallet, chainId, value) {
    const monaContractAddress = getMonaContractAddressByChainId(chainId);
    const contract = await getMonaTokenContract(monaContractAddress);
    try {
      const res = await contract.methods
        .transfer(address, convertToWei(value))
        .send({ from: wallet });
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async sendEth(wallet, value) {
    const web3 = window.web3;

    const amountToSend = convertToWei(value); // Convert to wei value
    var send = web3.eth.sendTransaction({ from: wallet, to: ethAddress, value: amountToSend });
  }

  async uploadImage(file) {
    try {
      let url = await api.getPresignedUrl();
      if (url) {
        const result = await api.uploadImageToS3(url, file);
        if (result) {
          // const user = getUser();
          const queryIndex = url.indexOf('?');
          if (queryIndex >= 0) {
            url = url.slice(0, queryIndex);
          }
          // user.avatar = url;
          // dispatch(this.updateProfile(user));
          return url;
        }
      }
    } catch (e) {
      throw e;
    }
  }
}

export default new DressedActions();
