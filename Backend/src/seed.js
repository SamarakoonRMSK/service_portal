require("dotenv").config();
const dns = require("node:dns/promises");
dns.setServers(["8.8.8.8","1.1.1.1"]);

const mongoose = require("mongoose");
const JobRequest = require("./models/JobRequest");

const sampleJobs = [
  {
    title: "Leaking kitchen tap",
    description:
      "Kitchen mixer tap has been dripping constantly for two weeks. Need a plumber to inspect and replace washers or the full tap unit if required.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "James Reid",
    contactEmail: "james.reid@example.com",
    status: "Open",
    createdAt: new Date("2026-03-10"),
  },
  {
    title: "Faulty consumer unit",
    description:
      "Consumer unit trips when the oven and washing machine run together. Looking for a qualified electrician to assess and upgrade if needed.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Sarah Campbell",
    contactEmail: "sarah.campbell@example.com",
    status: "In Progress",
    createdAt: new Date("2026-02-18"),
  },
  {
    title: "Garden fence repair",
    description:
      "Storm damage has left three fence panels loose and one post leaning. Need repair or replacement of affected sections.",
    category: "Landscaping",
    location: "Manchester",
    contactName: "David Hughes",
    contactEmail: "david.hughes@example.com",
    status: "Open",
    createdAt: new Date("2026-04-01"),
  },
  {
    title: "Bedroom repaint",
    description:
      "Master bedroom walls need a full repaint after wallpaper removal. Walls are in good condition; two coats of emulsion required.",
    category: "Painting",
    location: "London",
    contactName: "Emma Watson",
    contactEmail: "emma.watson@example.com",
    status: "Closed",
    createdAt: new Date("2026-01-22"),
  },
  {
    title: "Boiler service",
    description:
      "Annual boiler service due for a Worcester combi unit. Also check radiator pressure and bleed radiators on the ground floor.",
    category: "Plumbing",
    location: "Bristol",
    contactName: "Tom Fletcher",
    contactEmail: "tom.fletcher@example.com",
    status: "Open",
    createdAt: new Date("2026-04-12"),
  },
  {
    title: "Roof tile replacement",
    description:
      "Several slipped tiles on the rear slope after high winds. Need safe access and replacement of damaged tiles and ridge mortar check.",
    category: "Roofing",
    location: "Glasgow",
    contactName: "Alistair Murray",
    contactEmail: "alistair.murray@example.com",
    status: "In Progress",
    createdAt: new Date("2026-03-28"),
  },
  {
    title: "Hardwood floor sanding",
    description:
      "Living room parquet floor requires sanding, filling gaps, and three coats of hard-wearing lacquer. Approximately 25 square metres.",
    category: "Carpentry",
    location: "Edinburgh",
    contactName: "Fiona Grant",
    contactEmail: "fiona.grant@example.com",
    status: "Open",
    createdAt: new Date("2026-04-05"),
  },
  {
    title: "External wall crack",
    description:
      "Vertical crack visible on the front elevation brickwork, roughly 2 metres from ground level. Need structural assessment and repointing.",
    category: "Other",
    location: "Manchester",
    contactName: "Paul Singh",
    contactEmail: "paul.singh@example.com",
    status: "Closed",
    createdAt: new Date("2025-12-08"),
  },
  {
    title: "Bathroom tiling",
    description:
      "Full bathroom retile required: walls and floor. Tiles supplied; need experienced tiler for waterproofing and clean grout lines.",
    category: "Joinery",
    location: "London",
    contactName: "Rachel Green",
    contactEmail: "rachel.green@example.com",
    status: "In Progress",
    createdAt: new Date("2026-03-15"),
  },
  {
    title: "Loft insulation",
    description:
      "Loft has minimal insulation. Looking to install 270mm mineral wool rolls and board walkways to storage areas.",
    category: "Other",
    location: "Bristol",
    contactName: "Chris Morgan",
    contactEmail: "chris.morgan@example.com",
    status: "Open",
    createdAt: new Date("2026-04-08"),
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await JobRequest.deleteMany({});
    console.log("Cleared existing job requests");

    await JobRequest.insertMany(sampleJobs);
    console.log(`Successfully seeded ${sampleJobs.length} job requests`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
