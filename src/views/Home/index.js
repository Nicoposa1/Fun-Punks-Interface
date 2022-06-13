import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import useFunPunk from "../../hooks/useFunPunks/index";
import { useCallback, useEffect, useState } from "react";
import useTruncatedAddress from "../../hooks/useTruncatedAddress/index";

const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [availablePunks, setAvailablePunks] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const { active, account } = useWeb3React();
  const funPunks = useFunPunk();
  const toast = useToast();

  const getFunPunksData = useCallback(async () => {
    if (funPunks) {
      const totalSupply = await funPunks.methods.totalSupply().call();
      const maxSupply = await funPunks.methods.maxSupply().call();
      setAvailablePunks(maxSupply - totalSupply);
      const dnaPreview = await funPunks.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      const image = await funPunks.methods.imageByDNA(dnaPreview).call();
      setImageSrc(image);
    }
  }, [funPunks, account]);

  useEffect(() => {
    getFunPunksData();
  }, [getFunPunksData]);

  const truncatedAddress = useTruncatedAddress(account);

  const mint = () => {
    setIsMinting(true);
    funPunks.methods
      .mint()
      .send({
        from: account,
      })
      .on("transactionHash", (txHash) => {
        toast({
          title: "Transacción enviada",
          description: txHash,
          status: "info",
        });
      })
      .on("receipt", () => {
        setIsMinting(false);
        toast({
          title: "Transacción completada",
          description: "Eres un Fun Punk Lover",
          status: "success",
        });
        getFunPunksData()
      })
      .on("error", (error) => {
        setIsMinting(false);
        toast({
          title: "Transacción fallida",
          description: error.message,
          status: "error",
        });
      });
  };

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "green.400",
              zIndex: -1,
            }}
          >
            Un Fun Punk
          </Text>
          <br />
          <Text as={"span"} color={"green.400"}>
            nunca parar de aprender
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Fun Punks es una colección de Avatares randomizados cuya metadata es
          almacenada on-chain. Poseen características únicas y sólo hay 10000 en
          existencia.
        </Text>
        <Text color={"green.500"}>
          Cada Fun Punk se genera de forma secuencial basado en tu address, usa
          el previsualizador para averiguar cuál sería tu Fun Punk si minteas en
          este momento
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
            disabled={!funPunks}
            onClick={mint}
            isLoading={isMinting}
          >
            Obtén tu punk
          </Button>
          <Link to="/punks">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galería
            </Button>
          </Link>
        </Stack>
        <Text color={"gray.500"}>
          Fun Punks disponibles:{" "}
          <Badge ml={1} colorScheme="green" color={"green.700"}>
            {availablePunks}
          </Badge>
        </Text>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={active ? imageSrc : "https://avataaars.io/"} />
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  1
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  {truncatedAddress}
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getFunPunksData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;
