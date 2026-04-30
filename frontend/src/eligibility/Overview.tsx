import {
  Button,
  Card,
  Container,
  Group,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AreaChart, LineChart } from "@mantine/charts";
import { BusinessCard } from "../components";
import { useState, useEffect } from "react";
import type { BusinessProfile } from "../page_components";
import { getBusinessProfile } from "../services/businessProfileService";

function Eligibility_Overview() {
  const nav = useNavigate();

  const [formProgress, setFormProgress] = useState(0);
  const [business, setBusiness] = useState<BusinessProfile | null>();

  // Fetch Business
  useEffect(() => {
    const fetchBusiness = async () => {
      const result = await getBusinessProfile();
      setBusiness(result);
    };
    fetchBusiness();
  }, []);

  return (
    <>
      <Container fluid style={{ minWidth: 0, minHeight: 0 }}>
        <Stack gap="md">
          <BusinessCard
            businessName={business?.businessName}
            businessSector={business?.businessSector}
            businessType={business?.businessType}
          />
          <Card withBorder>
            <Title order={1}>Amortization Overview</Title>
            <SimpleGrid cols={2}>
              <Card>
                <Stack>
                  <Text>Amort KUR Count</Text>
                  <Stack>
                    <Card
                      withBorder
                      style={{ borderLeft: "4px solid #228be6" }}
                    >
                      KUR Super Mikro
                    </Card>
                    <Card
                      withBorder
                      style={{ borderLeft: "4px solid #228be6" }}
                    >
                      KUR Mikro
                    </Card>
                    <Card
                      withBorder
                      style={{ borderLeft: "4px solid #228be6" }}
                    >
                      KUR Kecil
                    </Card>
                  </Stack>
                </Stack>
              </Card>
              <Card>
                <Stack>
                  <Text>Calculation History</Text>
                  <Card withBorder>
                    <ScrollArea h={200}>
                      <Card>Test 1</Card>
                      <Card>Test 1</Card>
                      <Card>Test 1</Card>
                      <Card>Test 1</Card>
                    </ScrollArea>
                  </Card>
                </Stack>
              </Card>
            </SimpleGrid>
          </Card>
          <Card withBorder>
            <Title>KUR Eligibility</Title>
            <SimpleGrid cols={3}>
              <Card>KUR Super Mikro</Card>
              <Card>KUR Mikro</Card>
              <Card>KUR Kecil</Card>
            </SimpleGrid>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

export default Eligibility_Overview;
