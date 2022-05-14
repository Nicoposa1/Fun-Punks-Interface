import React, { useState } from "react";
import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import PunkCard from "../../components/punk-card";
import { usePunkdata } from "../../hooks/usePunksData";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import useFunPunks from "../../hooks/useFunPunks";

const Punk = () => {
  const { tokenId } = useParams();
  const { active, account, library } = useWeb3React();
  const { punk, loading, update } = usePunkdata(tokenId);
  const toast = useToast();
  const [trasfering, setTrasfering] = useState(false);
  const funPunks = useFunPunks();

  const transfer = () => {
    setTrasfering(true);

    const address = prompt("Ingresa la dirección: ");

    const isAddress = library.utils.isAddress(address);

    if (!isAddress) {
      toast({
        title: "Dirección inválida",
        description: "La dirección ingresada no es válida",
        status: "error",
      });
      setTrasfering(false);
    } else {
      funPunks.methods
        .safeTransferFrom(punk.owner, address, punk.tokenId)
        .send({
          from: account,
        })
        .on("error", () => {setTrasfering(false);})
        .on("transactionHash", (txHash) => {
          toast({
            title: "Transacción enviada",
            description: txHash,
            status: "info",
          })
        })
        .on("receipt", () => {
          setTrasfering(false)
          toast({
            title: "Transacción completada",
            description: `El punk ha sido transferido a ${address}`,
            status: "success",
          })
          update()
        });
    }
  };

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={punk.name}
          image={punk.image}
        />
        <Button
          onClick={transfer}
          disabled={account !== punk.owner}
          colorScheme="green"
          isLoading={trasfering}
        >
          {account !== punk.owner ? "No eres el dueño" : "Transferir"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{punk.name}</Heading>
        <Text fontSize="xl">{punk.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {punk.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {punk.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Punk;
