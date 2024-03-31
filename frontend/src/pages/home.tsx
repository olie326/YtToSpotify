import { useState, useEffect } from "react";
import axios from "axios";
import LoginButton from "../components/LoginButton";
import TestButton from "../components/testButton";
import SearchBar from "../components/searchBar";
import Nav from "../components/Nav";
import "../App.css";
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
  Section,
  Box,
} from "@radix-ui/themes";
import headphones from "../assets/headphones_rotate_md_clr.gif";
import { isAuthenticated } from "@/api/apiConfig";

axios.defaults.withCredentials = true;

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    isAuthenticated().then((response) => setAuthenticated(response));
  }, []);

  return (
    <Theme
      accentColor="orange"
      grayColor="gray"
      panelBackground="translucent"
      scaling="100%"
      radius="small"
    >
      <Flex
        direction="column"
        //"radial-gradient(circle, rgba(255,229,100,1) 9%, rgba(255,250,220,1) 69%, rgba(255,252,244,1) 100%)",
        className="min-h-svh content-around box-border bg-grad_background"
        style={{
          background:
            "radial-gradient(circle, rgba(255,238,195,1) 33%, rgba(255,250,229,1) 77%, rgba(255,254,243,1) 100%)",
        }}
      >
        <Nav />
        <Container size="3" className="flex-row justify-center">
          <Flex direction="column" gap="6" align="center">
            <Heading size="9" mb="3" align="center">
              Youtube to Spotify Playlist Converter
              <img src={headphones} alt="headphones" className="inline mx-3" />
            </Heading>
            <Text as="p" className="mx-3">
              A simple web-tool to convert video-style youtube playlists (videos
              that act as playlists) into Spotify playlists. To get started,
              login to Spotify and paste in a Youtube video link! Alternatively,
              If either the results are inconsistent or your looking to paste a
              list of songs to create a playlist,
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
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Link>
              </Button>
            </Text>
            <div className="max-w-[880px] w-full">
              <Flex
                direction="column"
                gap="2"
                align="center"
                className="mx-3 mb-12"
              >
                {authenticated ? <SearchBar /> : <LoginButton />}
                <TestButton />
              </Flex>
            </div>
          </Flex>
        </Container>

        <Section size="2">
          <Flex align="center" justify="center">
            <Text color="amber">Designed and developed by Oliver Lee.</Text>
          </Flex>
        </Section>
      </Flex>
    </Theme>
  );
}
