# Homepage Todos

---

## DONE

- [x] Replace MIMIR references with UNav-Sim (link to https://github.com/open-airlab/UNav-Sim)
- [x] Add paper links throughout the homepage
- [x] Replace all GIFs with WebMs
- [x] Expertise section — add expandable row-breakout panels (click card to reveal detail)
- [x] Expertise section — fill panels with PhD research content
- [x] Fix LinkedIn URL (https://www.linkedin.com/in/jonas-le-fevre/)
- [x] Simulation section — rewrite to lead with UNav-Sim, then generalise to other domains
- [x] Simulation section — add wind turbine inspection video (local WebM)
- [x] Simulation section — add wind estimation / TI demo video (local WebM)
- [x] Publications — add additional papers (ICAR 2023, RAL 2021, CASE 2021, Frontiers 2022, etc.)

---

## HIGH PRIORITY — Reframe the site

The site currently reads as a PhD portfolio. The target audience is industrial companies
(robotics engineers, CTOs, hiring managers). The goal is to present the *whole person*:
a full-stack engineer who did a PhD, not a PhD student who also does engineering.

### About section rewrite
- [ ] Change the headline — "Building the future of autonomous coordination" is generic.
      Something more personal and grounded: who Jonas is, not just what he works on.
- [ ] Rewrite body copy to lead with the industrial/engineering identity, not the PhD.
      Order of emphasis: engineer → researcher → builder.
      The PhD is a proof of depth, not the whole story.
- [ ] Reframe stats:
  - "3 Years of PhD" → something less academic (e.g. "Industrial PhD" or remove entirely)
  - "1K+ Robots in Fleet" — Jonas is hesitant about this; revisit wording to be accurate
    (it's the scale BEUMER operates at, not personal deployment)
- [ ] Add a profile photo (see Image Prompts section below)
- [ ] Update the about-grid layout to accommodate a photo alongside the text

### Hero section
- [ ] Revisit the tagline — currently very PhD-focused.
      Should hint at the breadth: research depth + real-world deployment + hardware.
      Example direction: "From circuit boards to robot fleets. Research that ships."
- [ ] Consider whether the "PhD · Multi-Agent Robotics · Aarhus University" pre-tag is still right,
      or whether it should lead with the role/industry angle.

---

## NEW SECTION — Work Experience / Career

- [ ] Add a Work Experience or Career Timeline section after About (before Expertise or after Expertise).
      This is currently completely absent and is essential for industrial hiring managers.
- [ ] Content to cover:
  - BEUMER Group A/S — Industrial PhD co-funding partner. What Jonas built there.
    (No visual content yet from BEUMER — use text/icons for now, add visuals later)
  - Pre-PhD work and other roles visible on LinkedIn
  - Aarhus University / AIR Lab — research role in context
- [ ] Section style: could be a vertical timeline, or a two-column role-card layout.
      Should match the dark hacker aesthetic but feel substantial, not academic.

---

## MEDIUM PRIORITY — Content & Polish

### Expertise panels
- [ ] Once Jonas has visual content from BEUMER, update the Embedded Systems & Hardware
      and Sensor Fusion panels to include real industrial project context.
- [ ] Consider adding a brief "Industrial" vs "Research" label to each panel
      to signal which skills have been deployed at scale.

### Technical fixes
- [ ] Fix copyright year in footer: 2025 → 2026
- [ ] Fix the blank/dead gap in the Research section
      (large empty space between the section header and first paper card)
- [ ] Add a CV / resume download button — either in the About section or the nav/hero.
      Needs an actual PDF to link to.

### Contact section
- [ ] The email is still @ece.au.dk (university address). Decide whether to keep this
      or add/switch to a personal email going forward.
- [ ] "Open to research collaborations, industry positions..." — adjust wording to
      emphasise industry-first given the target audience.

---

## LOW PRIORITY — Nice to Have

- [ ] Add a photo to the hero section or use a professional photo as a background element
- [ ] Expertise panel — once BEUMER context is added, consider a "Projects" or "Industry Work"
      sub-section within each panel beyond the current research-only content
- [ ] Add an Open Source section or GitHub highlight for repos that demonstrate breadth
      (fuse, LearningKalmanFilters, Course-on-Game-Theory-and-Self-Driving-Cars, etc.)
- [ ] Dark/light mode toggle — low priority but would show frontend care
- [ ] OG image for social sharing (currently no og:image meta tag)

---

## IMAGE PROMPTS & PHOTOGRAPHY DIRECTION

The site aesthetic is: black background (#07080A), cyan accent (#00d4ff), monospace fonts,
hacker/engineering tone. All images should feel at home in this palette — dark, high-contrast,
with cool/teal lighting where possible. No bright white backgrounds. No stock-photo cheerfulness.

---

### 1. Profile Photo (About section) — PHOTOGRAPHY SESSION NEEDED

This is the most important image. It will anchor the About section and make the site feel
like a real person rather than a CV document.

**Shoot direction:**
- Location: Robotics lab, workshop, or server room — somewhere that signals "engineer", not office.
  A blurred robot arm, screen glow, or circuit board in the background is ideal.
- Lighting: Single key light from one side (dramatic, Rembrandt-style). Avoid flat studio light.
  A monitor or LED strip providing a cyan/teal rim light on the far side would be perfect.
- Pose: Relaxed but direct. Looking at the camera. Not smiling broadly — composed, confident.
  Seated at a desk or standing with arms crossed/natural both work.
- Attire: Dark hoodie, dark shirt, or technical jacket. Nothing corporate.
- Framing: Head and shoulders to upper torso. Slight headroom. Not centred — slightly offset left
  so the image can sit to the right of the text in the about-grid.
- Post-processing: High contrast. Slightly desaturated (not B&W, but not punchy colour either).
  A subtle cyan colour grade in the shadows. Could add a very light film grain.
- Format: Portrait orientation, roughly 3:4 or 2:3 ratio. At least 800px wide for web.

---

### 2. AI-generated: Multi-robot coordination overhead view
*For About section background accent or Expertise MAPF panel*

Prompt (Midjourney / DALL-E / Stable Diffusion):
"Aerial top-down view of a large warehouse floor with dozens of autonomous mobile robots
navigating narrow aisles, dark industrial environment, cyan and blue holographic pathlines
overlaid showing robot trajectories, cinematic lighting, photorealistic, high contrast,
deep shadows, moody atmosphere, no people, clean composition --ar 16:9 --style raw"

Usage: Subtle background or section divider. Apply a dark overlay (70-80% opacity)
before placing text over it.

---

### 3. AI-generated: Graph neural network / factor graph visualization
*For Research section or Expertise panel (MAPF, Motion Planning)*

Prompt:
"Abstract glowing network graph with nodes and edges floating in dark space,
cyan and white light, hexagonal nodes, mathematical precision, factor graph structure,
data flowing along edges, futuristic, high detail, black background, no text,
geometric and clean --ar 16:9 --style raw"

Usage: Paper visual placeholder for CAMETA or Adaptive GBP if needed.
Or decorative section background element.

---

### 4. AI-generated: Drone approaching wind turbine
*For Simulation section "Beyond underwater" header, or wind turbine inspection paper card*

Prompt:
"Industrial quadrotor drone flying close to a massive offshore wind turbine blade,
overcast dramatic sky, dark grey clouds, photorealistic, cinematic composition,
the drone is small relative to the massive turbine, motion blur on the blades,
cool desaturated colour palette, teal/cyan atmospheric haze, eye-level perspective
looking along the blade --ar 16:9 --style raw"

Usage: Optional background for the sim-beyond section or as a visual for the
wind turbine paper in Publications.

---

### 5. AI-generated: Embedded hardware close-up
*For Expertise panel (Embedded Systems & Hardware)*

Prompt:
"Extreme close-up macro photograph of a custom PCB circuit board, STM32 microcontroller,
soldered components, dark background, selective focus with shallow depth of field,
green and cyan LED light glowing from components, industrial quality, sharp details
on the chips and traces, moody professional product photography --ar 4:3 --style raw"

Usage: Visual anchor for the Embedded Systems expertise panel.

---

### 6. AI-generated: Underwater AUV / ocean floor
*For UNav-Sim section header or MIMIR publication visual*

Prompt:
"Photorealistic underwater scene, autonomous underwater vehicle (AUV) submarine robot
exploring a dark ocean floor, bioluminescent particles drifting, deep blue-black water,
volumetric god-rays from above, cinematic, moody, isolated robot in vast underwater space,
photorealistic Unreal Engine render quality --ar 16:9 --style raw"

Usage: Optional decorative header for the Simulation section.
Could replace or supplement the current gif-grid header area.

---

### 7. AI-generated: Warehouse robot fleet (for Work Experience section)
*For BEUMER / industrial career section — if adding a Work Experience block*

Prompt:
"Wide-angle view inside a modern automated logistics warehouse, multiple autonomous mobile
robots moving between large shelving racks, warm industrial overhead lighting contrasted
with cool blue sensor beams, no people visible, conveyor belts, high ceilings,
cinematic depth of field, photorealistic, slightly desaturated --ar 16:9 --style raw"

Usage: Background or card visual for the BEUMER/industrial work section.
Use a dark overlay when placing text over it.


### 8. Interactive baggage handling minigame (new canvas section)

**Context:** The current hero `simulation.js` is a background animation — keep it as-is.
This is a NEW interactive canvas demo, placed in its own section (likely between Expertise and
Research, or as a standalone "Live Demo" block). It demonstrates MAPF/fleet scheduling in a
context industrial hiring managers immediately understand: airport baggage logistics.
Robots are still cyan dots with trails and GNN edges — same visual language, but now they have
a job to do. The viewer can interact with it.

**Why this works for the audience:** BEUMER's core business is exactly this — automated
baggage and parcel handling. This demo makes the research legible without any robotics background.

#### 8a. Floor layout design
- [ ] Define a fixed set of Pickup Zones (~3–4): represent baggage conveyor belt ends / arrivals
- [ ] Define a fixed set of Dropoff Zones (~4–6): represent departure gates or sorting stations
- [ ] Draw zones on canvas as distinct markers in site aesthetic:
      - Pickup: small horizontal chevron/conveyor symbol, cyan outline, labelled "Arrival A" etc.
      - Dropoff: numbered square gate icon, slightly warmer accent (e.g. white/off-cyan), labelled "Gate 1" etc.
- [ ] Zones positioned around the canvas edges/corners, leaving the centre clear for robot movement
- [ ] Keep the dark background (#07080A) and GNN edges between nearby robots

#### 8b. Bag spawning system
- [ ] Bags auto-spawn at pickup zones on a timer (e.g. one every 4–6 seconds)
- [ ] Unassigned bags shown as a small glowing square/diamond sitting at the pickup zone
- [ ] Queue cap per zone (e.g. max 3 waiting bags) — prevents runaway accumulation
- [ ] When a bag is picked up, it disappears from the zone marker

#### 8c. Robot state machine
Extend `Agent` class from random wandering to a proper task lifecycle:
- [ ] States: `IDLE` → `TO_PICKUP` → `AT_PICKUP` (brief 0.5s pause) → `TO_DROPOFF` → `AT_DROPOFF` (brief pause) → `IDLE`
- [ ] When `IDLE`: robot wanders exactly like current behavior (preserves existing feel)
- [ ] When carrying a bag: draw a small dot/square orbiting the robot, slightly warmer glow
- [ ] Smooth steering toward target zone using existing velocity-smoothing approach (no need for full pathfinding)

#### 8d. Task dispatcher (fleet scheduler)
- [ ] When a bag spawns unassigned AND an idle robot exists: assign nearest idle robot
- [ ] Assignment is greedy (nearest-first) — explicitly mirrors the research problem statement
      (can mention in a caption: "Greedy baseline — the research replaces this with GNN-based prediction")
- [ ] If all robots are busy, bags queue at pickup zones waiting for a robot to free up

#### 8e. Interactivity — click to route a bag
- [ ] Hovering a dropoff zone: cursor changes, zone pulses with a label "Click to route a bag here"
- [ ] Clicking a dropoff zone: spawns a bag at a random pickup zone, assigns it to that specific gate
- [ ] Brief visual feedback on click: zone flashes cyan, a new bag appears at the pickup zone and
      a robot immediately heads for it
- [ ] Tooltip/hint text somewhere on the canvas: "Click a gate to dispatch a bag"

#### 8f. HUD / status display
- [ ] Small monospace status overlay in one corner (matching site font):
      "12 bags delivered · 3 in transit · 2 waiting"
- [ ] Counters increment live as robots complete deliveries
- [ ] Optional: a "fleet efficiency" percentage that climbs as deliveries complete
      (purely cosmetic but gives the viewer a sense of system performance)

#### 8g. Section wrapper in HTML/CSS
- [ ] New `<section id="demo">` added to nav and page
- [ ] Section header: small label "Live Demo", headline something like
      "Fleet coordination — watch it work." with a one-liner explaining what's happening
- [ ] Canvas fills the section (fixed height, ~500–600px, full width)
- [ ] Below canvas: brief caption explaining the research connection
      ("Each robot uses local sensing only. No central controller. No communication between agents.")

#### 8h. Out of scope for v1 (note for future)
- Charging stations (robots deplete energy and must recharge before next task)
- Plane arrivals / departures (burst event triggering a surge of bags at a pickup zone)
- Multiple bag priorities (urgent bags jump the queue)
- Pathfinding around obstacles (currently straight-line steering is fine)

---

## NOTES

- Expertise panel BEUMER content: hold until Jonas has real visual material to show.
  Placeholder text is fine for now; don't fabricate project descriptions.
- All AI-generated images should be run through the site's colour grading
  (desaturate slightly, add dark overlay, optionally tint shadows toward #00d4ff cyan)
  so they feel native to the dark hacker palette rather than pasted in.
- WebM conversion of windturbine-inspection.webm was still running when this was written —
  verify the file is complete before pushing.
