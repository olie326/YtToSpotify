import { useState, useEffect } from "react";
import axios from "axios";
import LoginButton from "./components/LoginButton";
import TestButton from "./components/testButton";
import SearchBar from "./components/searchBar";
import Nav from "./components/Nav";
import "./App.css";
import {
  Heading,
  Text,
  Theme,
  Flex,
  Container,
  Card,
  Link,
  Skeleton,
  Button,
} from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";

axios.defaults.withCredentials = true;

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/login/authenticated").then((response) => {
      console.log("whattt", response);
      if (response.data.is_authenticated === "true") {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, []);

  return (
    <>
      <Theme
        accentColor="jade"
        grayColor="gray"
        panelBackground="translucent"
        scaling="100%"
        radius="medium"
      >
        <div className="m-3">
          <Nav />
          <Container size="2">
            <Flex direction="column" gap="5">
              <Heading size="9" m="5" mb="0" align="center">
                Youtube to Spotify
              </Heading>
              <Text as="p" mx="5" my="2">
                A simple web-tool to convert video-style youtube playlists
                (videos that act as playlists) into Spotify playlists. To get
                started, login to Spotify and paste in a Youtube video link!
                Alternatively, If either the results are inconsistent or your
                looking to paste a list of songs to create a playlist,
                <Button
                  asChild
                  variant="ghost"
                  size="3"
                  className="p-0 px-1 gap-1 hover:bg-white"
                >
                  <Link>
                    click here
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </Button>
              </Text>
            </Flex>
          </Container>
          <Container size="1" mt="2">
            <Flex direction="column" gap="2">
              {authenticated ? <SearchBar /> : <LoginButton />}
              <TestButton />
            </Flex>
          </Container>
        </div>
      </Theme>
    </>
  );
}

export default App;
