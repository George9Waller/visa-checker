"use client";

import {
  Btn,
  IconBtn,
  Input,
  Textarea,
  Checkbox,
  StatusPip,
  Flag,
  Kicker,
  Display,
  Text,
  Divider,
  Icon,
  PageContainer,
  PageHeader,
  SectionHeader,
  Stack,
  Row,
  Grid,
  StickyBar,
  Field,
  DatePicker,
  StatusBadge,
  UsageBar,
  AlertRow,
  AlertBox,
  EmptyState,
  Fact,
  FactGrid,
  StatCard,
  TagPill,
  TimelineSectionHeader,
  YearGroup,
  OptionRow,
  OptionGrid,
  OptionList,
  WizardShell,
  FAB,
  DashboardHeader,
  TripHeroCard,
  TripTimelineRow,
  TripCard,
  VisaListRow,
  SchengenProjectionChart,
} from "@/app/design";
import { useState, useMemo, useEffect } from "react";
import { getSavedScheme, saveScheme } from "@/app/components/ThemeProvider";

export default function DesignSystemShowcase() {
  const [selectedOption, setSelectedOption] = useState<string>("FR");
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardMode, setWizardMode] = useState(false);
  const [pickedDate, setPickedDate] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const chartToday = useMemo(() => new Date(), []);
  const mockPoints = useMemo(() => {
    return Array.from({ length: 73 }, (_, i) => {
      const date = new Date(chartToday.getTime() + i * 5 * 86400000);
      const base = 30;
      const trip = i > 10 && i < 30 ? (i - 10) * 2 : 0;
      const recovery = i > 50 ? (i - 50) * 1.2 : 0;
      const used = Math.min(90, Math.max(0, base + trip - recovery));
      return { date, remaining: Math.round(90 - used) };
    });
  }, [chartToday]);

  // Initialize theme from saved preference
  useEffect(() => {
    const saved = getSavedScheme();
    setTheme(saved === "system" ? "light": saved);
  }, []);

  // Update theme when toggle is clicked
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    saveScheme(newTheme);
    setTheme(newTheme);
  };

  if (wizardMode) {
    return (
      <WizardShell
        title="New trip"
        step={wizardStep}
        totalSteps={3}
        stepTitle={["Destination", "Dates", "Visa"][wizardStep]}
        onClose={() => setWizardMode(false)}
        onBack={wizardStep > 0 ? () => setWizardStep(wizardStep - 1) : null}
        primary={{
          label: wizardStep === 2 ? "Create trip" : "Continue",
          onClick: () => {
            if (wizardStep < 2) setWizardStep(wizardStep + 1);
            else setWizardMode(false);
          },
          enabled: true,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Step {wizardStep + 1} content</h2>
        <p>This is where wizard step content goes.</p>
      </WizardShell>
    );
  }

  return (
    <PageContainer density="comfortable">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 -mx-5">
        <div className="text-lg font-display font-semibold text-fg">
          Design System Showcase
        </div>
        <Btn
          variant="outline"
          size="sm"
          onClick={handleThemeToggle}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size="sm" />
          {theme === "dark" ? "Light" : "Dark"}
        </Btn>
      </div>

      <Stack gap="xl" className="mt-8">
        {/* Buttons */}
        <section>
          <SectionHeader num="01" title="Buttons" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <Row gap="sm">
              <Btn variant="primary" size="sm">
                Small
              </Btn>
              <Btn variant="primary" size="md">
                Medium
              </Btn>
              <Btn variant="primary" size="lg">
                Large
              </Btn>
            </Row>
            <Row gap="sm">
              <Btn variant="accent">Accent</Btn>
              <Btn variant="ghost">Ghost</Btn>
              <Btn variant="outline">Outline</Btn>
              <Btn variant="danger">Danger</Btn>
            </Row>
            <Row gap="sm">
              <IconBtn>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 3l-5 5 5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </IconBtn>
              <Btn disabled>Disabled</Btn>
            </Row>
          </Stack>
        </section>

        {/* Inputs */}
        <section>
          <SectionHeader num="02" title="Inputs" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <Field label="Text input">
              <Input placeholder="Type something..." />
            </Field>
            <Field label="Textarea" optional>
              <Textarea rows={3} placeholder="Type a description..." />
            </Field>
            <Checkbox>I agree to the terms</Checkbox>
            <Field label="Date picker">
              <DatePicker
                value={pickedDate}
                onChange={setPickedDate}
                placeholder="Select a date"
              />
            </Field>
          </Stack>
        </section>

        {/* Status & Display */}
        <section>
          <SectionHeader num="03" title="Status & Display" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <Row gap="md" align="center">
              <StatusPip tone="ok" size="sm" />
              <StatusBadge tone="ok">Valid</StatusBadge>
              <StatusBadge tone="warn" size="xs">
                Warning
              </StatusBadge>
              <StatusBadge tone="danger">Expired</StatusBadge>
            </Row>
            <UsageBar used={90} limit={180} tone="warn" showLabels={true} />
            <Fact label="From" value="April 18, 2026" />
            <FactGrid>
              <Fact label="Duration" value="7 days" />
              <Fact label="Status" value="Valid" />
              <Fact label="Expires" value="May 25, 2026" />
            </FactGrid>
          </Stack>
        </section>

        {/* Stats & Tags */}
        <section>
          <SectionHeader num="03b" title="Stats & Tags" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <Grid cols={2} gap="md">
              <StatCard label="Valid Visas" sublabel="3" onClick={() => {}} />
              <StatCard label="Days Used" sublabel="45/90" onClick={() => {}}>
                <Text variant="body">Some other content</Text>
              </StatCard>
            </Grid>
            <Row gap="sm">
              <TagPill flag="🇫🇷" label="France" />
              <TagPill flag="🇩🇪" label="Germany" />
              <TagPill flag="🇪🇸" label="Spain" />
            </Row>
          </Stack>
        </section>

        {/* Alerts */}
        <section>
          <SectionHeader num="04" title="Alerts & Feedback" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <AlertRow
              tone="warn"
              title="Schengen warning"
              detail="15 days left"
              action="Review"
            />
            <AlertBox tone="danger" title="Trip requires visa">
              You have no visa linked for France.
            </AlertBox>
            <EmptyState
              icon="📭"
              title="No visas yet"
              message="Create your first visa to get started"
            />
          </Stack>
        </section>

        {/* Selection */}
        <section>
          <SectionHeader num="05" title="Selection Components" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <OptionList>
              <OptionRow
                flag="🇫🇷"
                title="France"
                selected={selectedOption === "FR"}
                onClick={() => setSelectedOption("FR")}
              />
              <OptionRow
                flag="🇪🇸"
                title="Spain"
                selected={selectedOption === "ES"}
                onClick={() => setSelectedOption("ES")}
              />
            </OptionList>
            <OptionGrid>
              <OptionRow
                flag="🇫🇷"
                title="France"
                selected={selectedOption === "FR"}
                onClick={() => setSelectedOption("FR")}
                variant="grid"
              />
              <OptionRow
                flag="🇪🇸"
                title="Spain"
                selected={selectedOption === "ES"}
                onClick={() => setSelectedOption("ES")}
                variant="grid"
              />
            </OptionGrid>
          </Stack>
        </section>

        {/* Typography */}
        <section>
          <SectionHeader num="06" title="Typography" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <Display level={1}>Hero heading</Display>
            <Display level={2}>Large heading</Display>
            <Display level={3}>Medium heading</Display>
            <Display level={4}>Small heading</Display>
            <Text variant="body">Regular body text</Text>
            <Text variant="meta" tone="muted">
              Metadata label
            </Text>
            <Kicker>Label</Kicker>
            <Divider label="Section divider" />
            <Row gap="md" align="center">
              <Flag size="sm">🇫🇷</Flag>
              <Flag size="md">🇩🇪</Flag>
              <Flag size="lg">🇪🇸</Flag>
            </Row>
          </Stack>
        </section>

        {/* Page Header */}
        <section>
          <SectionHeader num="07" title="Page Header & Layout" />
          <Stack
            gap="md"
            className="bg-bg-raised p-0 rounded-lg border border-border overflow-hidden"
          >
            <PageHeader
              title="Example Page"
              kicker="Section"
              flag="🇫🇷"
              onBack={() => {}}
              actions={
                <Btn size="sm" variant="outline">
                  Edit
                </Btn>
              }
            />
            <div className="p-4">
              <Grid cols={2} gap="md">
                <div className="p-3 bg-bg-sunken rounded">Column 1</div>
                <div className="p-3 bg-bg-sunken rounded">Column 2</div>
              </Grid>
              <Row gap="md" justify="between" className="mt-4">
                <div>Left</div>
                <div>Right</div>
              </Row>
            </div>
            <StickyBar position="bottom" className="p-3 flex gap-2 justify-end">
              <Btn variant="ghost" size="sm">
                Cancel
              </Btn>
              <Btn variant="primary" size="sm">
                Save
              </Btn>
            </StickyBar>
          </Stack>
        </section>

        {/* Trip Cards */}
        <section>
          <SectionHeader num="08" title="Trip Cards" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <TripCard
              flag="🇫🇷"
              title="Paris"
              dateRange="April 18–25, 2026"
              length={7}
              statusTone="ok"
              statusLabel="Valid"
              visaLabel="Schengen"
            />
            <TripCard
              flag="🇩🇪"
              title="Berlin"
              dateRange="May 01–08, 2026"
              length={7}
              statusTone="ok"
              statusLabel="Valid"
              visaLabel="Schengen"
              isPast={true}
            />
          </Stack>
        </section>

        {/* Business blocks */}
        <section>
          <SectionHeader num="09" title="Business Blocks" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <DashboardHeader
              date={new Date()}
              weekday="Friday"
              title="Trips"
              actions={
                <Btn size="sm" variant="outline">
                  Visas
                </Btn>
              }
            />
            <TripHeroCard
              flag="🇫🇷"
              title="Paris"
              livePill
              subtitle="Day 3 of 7"
            />
            <TripTimelineRow
              date={new Date("2026-05-01")}
              month="May"
              title="Berlin"
              flag="🇩🇪"
              meta="May 01–08"
              length={7}
              statusTone="ok"
              statusLabel="Valid"
            />
            <VisaListRow
              flag="🇪🇺"
              title="Schengen"
              kicker="90 days in 180"
              countryCount={27}
              statusTone="ok"
              statusLabel="Valid"
              usage={{ used: 30, limit: 90 }}
            />
          </Stack>
        </section>

        {/* Timeline & Groups */}
        <section>
          <SectionHeader num="10" title="Timeline & Groups" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <TimelineSectionHeader label="May 2026" count={3} />
            <YearGroup year={2026}>
              <div className="text-sm text-fg-muted">Trip 1: Paris (Apr 18–25)</div>
              <div className="text-sm text-fg-muted">Trip 2: Berlin (May 1–8)</div>
              <div className="text-sm text-fg-muted">Trip 3: Barcelona (May 15–20)</div>
            </YearGroup>
          </Stack>
        </section>

        {/* Wizard trigger */}
        <section>
          <SectionHeader num="11" title="Wizard" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <Btn onClick={() => setWizardMode(true)}>Open wizard</Btn>
          </Stack>
        </section>

        {/* FAB demo */}
        <section>
          <SectionHeader num="12" title="Floating Action Button" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            <p className="text-sm text-fg-muted">
              See FAB in bottom-right corner when scrolling.
            </p>
            <FAB
              actions={[
                {
                  icon: "✈️",
                  title: "Trip",
                  description: "Plan or log a journey",
                  onClick: () => alert("Create trip"),
                },
                {
                  icon: "🛂",
                  title: "Visa",
                  description: "Add an entry permit",
                  onClick: () => alert("Create visa"),
                },
              ]}
            />
          </Stack>
        </section>

        {/* Icons */}
        <section>
          <SectionHeader num="13" title="Icons" />
          <Stack
            gap="md"
            className="bg-bg-raised p-4 rounded-lg border border-border"
          >
            {(["xs", "sm", "md", "lg"] as const).map((size) => (
              <div key={size}>
                <div className="font-mono text-[10px] text-fg-muted tracking-wide mb-2">
                  {size.toUpperCase()}
                </div>
                <div className="grid grid-cols-5 gap-4 md:grid-cols-8">
                  {[
                    "chevron-left",
                    "chevron-right",
                    "close",
                    "arrow-right",
                    "plus",
                    "check",
                    "check-small",
                    "calendar",
                    "edit",
                    "trash",
                    "visa-card",
                    "user",
                    "search",
                    "sun",
                    "moon",
                  ].map((name) => (
                    <div
                      key={name}
                      className="flex flex-col items-center gap-1"
                    >
                      <Icon name={name} size={size} />
                      <span className="font-mono text-[7px] text-fg-faint text-center leading-tight">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Stack>
        </section>

        {/* SchengenProjectionChart */}
        <section>
          <SectionHeader num="14" title="Schengen Projection Chart" />
          <SchengenProjectionChart
            points={mockPoints}
            limit={90}
            windowDays={180}
            today={chartToday}
          />
        </section>

        <div className="h-20" />
      </Stack>
    </PageContainer>
  );
}
