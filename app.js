const sequenceColours = {
  "Warm-up": "#f3b0bf",
  "Standing Preparation": "#9ec7ef",
  "Sun Salutation A": "#f5d66f",
  "Triangle Flow": "#8fc6b4",
  "Warrior Flow": "#ef9277",
  "Balancing Flow": "#b9d974",
  "Hipster Flow": "#d3b7e6",
  "Arm Balancing": "#f5b46f",
  "Back Bends": "#df9bb9",
  "Forward Bends": "#9fc8c4",
  "Finishing Sequence": "#bcb6e8"
};

const script = document.querySelector("#script");
const sequenceNav = document.querySelector("#sequenceNav");
const poseTemplate = document.querySelector("#poseTemplate");
const currentSequence = document.querySelector("#currentSequence");
const currentPose = document.querySelector("#currentPose");
const totalPoses = document.querySelector("#totalPoses");
const progress = document.querySelector("#pageProgress");

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function emphasiseBreath(text) {
  const fragment = document.createDocumentFragment();
  const parts = text.split(/\b(Inhale|Exhale)\b/gi);

  parts.forEach((part) => {
    if (/^(inhale|exhale)$/i.test(part)) {
      const span = document.createElement("span");
      span.className = `breath breath-${part.toLowerCase()}`;
      span.textContent = part;
      fragment.append(span);
    } else {
      fragment.append(document.createTextNode(part));
    }
  });

  return fragment;
}

function groupBySequence(items) {
  return items.reduce((groups, item) => {
    if (!groups.has(item.sequence)) groups.set(item.sequence, []);
    groups.get(item.sequence).push(item);
    return groups;
  }, new Map());
}

function renderPose(pose) {
  const node = poseTemplate.content.cloneNode(true);
  const article = node.querySelector(".pose");
  const number = node.querySelector(".pose-number");
  const sanskrit = node.querySelector(".pose-sanskrit");
  const english = node.querySelector(".pose-english");
  const cue = node.querySelector(".pose-cue");

  article.id = `pose-${pose.flowNumber}`;
  article.dataset.flowNumber = pose.flowNumber;
  article.dataset.sequence = pose.sequence;
  number.textContent = String(pose.flowNumber).padStart(3, "0");
  sanskrit.textContent = pose.sanskrit;
  english.textContent = pose.english;
  cue.append(emphasiseBreath(pose.cue));

  return node;
}

function renderSequence(name, poses) {
  const section = document.createElement("section");
  const id = `sequence-${slugify(name)}`;
  section.className = "sequence-section";
  section.id = id;
  section.style.setProperty("--accent", sequenceColours[name] || "#f3b0bf");

  const heading = document.createElement("h2");
  heading.className = "sequence-title";
  heading.textContent = name;

  const body = document.createElement("div");
  body.className = "sequence-body";
  poses.forEach((pose) => body.append(renderPose(pose)));

  section.append(heading, body);
  script.append(section);

  const link = document.createElement("a");
  link.className = "sequence-link";
  link.href = `#${id}`;
  link.textContent = name;
  sequenceNav.append(link);
}

function observePoses() {
  const poses = [...document.querySelectorAll(".pose")];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (!visible) return;
      currentPose.textContent = visible.target.dataset.flowNumber;
      currentSequence.textContent = visible.target.dataset.sequence;
    },
    { rootMargin: "-20% 0px -68% 0px", threshold: 0 }
  );

  poses.forEach((pose) => observer.observe(pose));
}

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.height = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}

async function init() {
  try {
    const response = await fetch("./data/flow.json");
    if (!response.ok) throw new Error(`Could not load flow data (${response.status})`);

    const poses = await response.json();
    totalPoses.textContent = poses.length;

    groupBySequence(poses).forEach((items, name) => renderSequence(name, items));
    observePoses();
    updateProgress();
  } catch (error) {
    script.innerHTML = `<p class="load-error">Sorry, the flow could not be loaded. ${error.message}</p>`;
    console.error(error);
  }
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
init();
