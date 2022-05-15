import { useCallback, useEffect, useState } from "react";
import useFunPunks from "../useFunPunks";
import { useWeb3React } from "@web3-react/core";

const getPunkData = async ({ funPunks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriestype,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    funPunks.methods.tokenURI(tokenId).call(),
    funPunks.methods.tokenDNA(tokenId).call(),
    funPunks.methods.ownerOf(tokenId).call(),
    funPunks.methods.getAccessoriesType(tokenId).call(),
    funPunks.methods.getClotheColor(tokenId).call(),
    funPunks.methods.getClotheType(tokenId).call(),
    funPunks.methods.getEyeType(tokenId).call(),
    funPunks.methods.getEyeBrowType(tokenId).call(),
    funPunks.methods.getFacialHairColor(tokenId).call(),
    funPunks.methods.getFacialHairType(tokenId).call(),
    funPunks.methods.getHairColor(tokenId).call(),
    funPunks.methods.getHatColor(tokenId).call(),
    funPunks.methods.getGraphicType(tokenId).call(),
    funPunks.methods.getMouthType(tokenId).call(),
    funPunks.methods.getSkinColor(tokenId).call(),
    funPunks.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accessoriestype,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

//Plural
const usePunksData = ({ owner = null }) => {
  const [punks, setPunks] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const funPunks = useFunPunks();

  const update = useCallback(async () => {
    if (funPunks) {
      setLoading(true);

      let tokenIds;

      if(!library.utils.isAddress(owner)){
        const totalSupply = await funPunks.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);
      }else {
        const balanceOf = await funPunks.methods.balanceOf(owner).call();

        const tokenIdsOfOwner = new Array(Number(balanceOf)).fill().map((_, index) => 
          funPunks.methods.tokenOfOwnerByIndex(owner, index).call()
        )

        tokenIds = await Promise.all(tokenIdsOfOwner)
      }

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, funPunks })
      );

      const punks = await Promise.all(punksPromise);

      setPunks(punks);

      setLoading(false);
    }
  }, [funPunks, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return { punks, loading, update };
};

const usePunkdata = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const funPunks = useFunPunks();

  const update = useCallback(async () => {
    if (funPunks && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, funPunks });
      setPunk(toSet);

      setLoading(false);
    }
  }, [funPunks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return { punk, loading, update };
};

export { usePunksData, usePunkdata };
