import { useWeb3React } from "@web3-react/core";
import {
  Grid,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Button,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import PunkCard from "../../components/punk-card";
import RequestAccess from "../../components/request-access";
import Loading from "../../components/loading";
import { usePunksData } from "../../hooks/usePunksData";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Punks = () => {
  const { search } = useLocation();
  const [address, setAddress] = useState(new URLSearchParams(search).get("address"));
  const [submitted, setSubmitted] = useState(true);
  const [validAddress, setValidAddress] = useState(true);
  const navigate = useNavigate();
  const { active, library } = useWeb3React();
  const { punks, loading } = usePunksData({
    owner: submitted && validAddress ? address : null
  });

  const handleAddressChange = ({ target: { value } }) => {
    setAddress(value);
    setSubmitted(false);
    setValidAddress(false);
  };

  const submit = (event) => {
    event.preventDefault();

    if (address) {
      const isValid = library.utils.isAddress(address)
      setValidAddress(isValid);
      setSubmitted(true);
      if(isValid) {
        navigate(`/punks?address=${address}`)
      }
    } else {
      navigate("/punks");
    }
  };

  if (!active) return <RequestAccess />;

  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              isInvalid={false}
              value={address ?? ""}
              onChange={handleAddressChange}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {submitted && !validAddress && (
            <FormHelperText>Dirección invalidad</FormHelperText>
          )}
        </FormControl>
      </form>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {punks.map(({ name, image, tokenId }) => (
            <Link key={tokenId} to={`/punks/${tokenId}`}>
              <PunkCard name={name} image={image} />
            </Link>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Punks;
