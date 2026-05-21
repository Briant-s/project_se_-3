import { Button, ScrollArea, Stack } from "@mantine/core";
import type { NavItem } from "../types";
import { NavLinkGroup } from "../lib";
import { brandColors } from "../gradients";
import { useState, useEffect } from "react"; 
import { getBusinessProfile } from "../services/businessProfileService";
import { Link } from "react-router-dom";

interface Props {
  mainNav: NavItem[];
}

function Sidebar({ mainNav }: Props) {
  // State untuk melacak apakah kuis sudah selesai (100%)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        const business = await getBusinessProfile();
        if (!business) return;

        // Daftar field yang ada di dalam form kuis
        const fields = [
          business.businessName,
          business.businessAge,
          business.ownerName,
          business.businessLocation,
          business.businessType,
          business.businessSector,
          business.totalEmployees,
          business.storeType,
          business.monthlyAverageIncome,
          business.monthlyAverageProfitLoss,
          business.businessAssets,
          business.isOtherKredit,
        ];

        // Hitung berapa banyak field yang sudah terisi
        const filled = fields.filter(
          (value) => value !== null && value !== undefined && value !== ""
        ).length;

        // Hitung persentase progress
        const progress = Math.round((filled / fields.length) * 100);
        
        // Jika 100%, set state menjadi true agar tombol disembunyikan
        setIsQuizCompleted(progress === 100);
      } catch (error) {
        console.error("Error checking quiz status in Sidebar:", error);
      }
    };

    checkQuizStatus();
    window.addEventListener("quiz_updated", checkQuizStatus);
    return () => {
      window.removeEventListener("quiz_updated", checkQuizStatus);
    };
  }, []);

  return (
    <Stack justify="space-between" h="calc(100vh - 80px)" gap="md">
      <Stack gap="sm" style={{ flex: 1, overflow: "hidden" }}>

        {/* HANYA MUNCUL JIKA KUIS BELUM 100% */}
        {!isQuizCompleted && (
          <Link to="/my-business/profile-quiz" style={{ textDecoration: "none", width: "100%" }}>
          <Button
            style={{
              background: brandColors.primaryButton,
            }}
            fullWidth
          >
            Fill Out Business Quiz
          </Button>
        </Link>
        )}

        <ScrollArea scrollbars="y" flex={1}>
          <Stack gap={4}>
            {mainNav.map((item) => (
              <NavLinkGroup key={item.label} link={item} />
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Stack>
  );
}

export default Sidebar;


