import { useWeb3React } from "@web3-react/core";
import { Grid } from "@chakra-ui/react";
import PunkCard from "../../components/punk-card";
import RequestAccess from "../../components/request-access";
import Loading from "../../components/loading";
import { usePunksData } from "../../hooks/usePunksData";
import { Link } from "react-router-dom";

const Punks = () => {
  const { active } = useWeb3React();
  const { punks, loading } = usePunksData();

  if (!active) return <RequestAccess />;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {punks.map(({ name, image, tokenId }) => (
            <Link key={tokenId}  to={`/punks/${tokenId}`}>
              <PunkCard name={name} image={image} />
            </Link>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Punks;
