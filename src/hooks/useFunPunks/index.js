import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import FunPunksActifacts from "../../config/actifacts/FunPunks";


const { address, abi } = FunPunksActifacts;

const useFunPunks = () => {
  const { active, library, chainId } = useWeb3React();

  const funPunks = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract])

  return funPunks
}

export default useFunPunks

