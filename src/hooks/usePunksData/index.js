import { useCallback, useEffect, useState } from "react";
import useFunPunks from "../useFunPunks";

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
const usePunksData = () => {
  const [punks, setPunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const funPunks = useFunPunks()

  const update = useCallback(async () => {
    if(funPunks) {
      setLoading(true);

      let tokenIds;

      const totalSupply = await funPunks.methods.totalSupply().call();
      tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index )
      const punksPromise = tokenIds.map((tokenId) => getPunkData({ tokenId, funPunks }))

      const punks = await Promise.all(punksPromise);

      setPunks(punks)

      setLoading(false);
    }
  }, [funPunks]) 

  useEffect(() => {
    update()
  }, [update])

  return { punks, loading, update }

};

export {usePunksData}
