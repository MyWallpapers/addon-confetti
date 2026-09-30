import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
import "./style.css";
export function mount(context: CanvasAddonMountContext) {
  const node = document.createElement("div");
  node.className =
    "burst" + (context.runtime.mode === "thumbnail" ? " still" : "");
  node.setAttribute("role", "img");
  node.setAttribute("aria-label", "Gerbe de confettis");
  context.layer.root.replaceChildren(node);
  let values = context.layer.settings.get(),
    sequence = 0;
  const render = () => {
    node.replaceChildren();
    let seed = 7409 + sequence++ * 37;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4294967296;
    };
    const bounds = context.layer.root.getBoundingClientRect(),
      width = bounds.width || context.runtime.instance.width,
      height = bounds.height || context.runtime.instance.height;
    for (let i = 0; i < Number(values.count ?? 48); i++) {
      const piece = document.createElement("i"),
        angle = random() * Math.PI * 2,
        radius = 0.2 + random() * 0.8;
      piece.className = "piece";
      piece.style.backgroundColor = String(
        i % 3 === 0
          ? (values.secondary ?? "#879d94")
          : (values.color ?? "#c9b697"),
      );
      piece.style.setProperty(
        "--x",
        Math.cos(angle) * width * 0.42 * radius + "px",
      );
      piece.style.setProperty(
        "--y",
        Math.sin(angle) * height * 0.28 * radius + height * 0.15 + "px",
      );
      piece.style.setProperty("--rotation", random() * 360 + "deg");
      piece.style.setProperty(
        "--duration",
        Number(values.duration ?? 4) * (0.85 + random() * 0.15) + "s",
      );
      node.append(piece);
    }
  };
  const stop = context.layer.settings.subscribe((next) => {
      values = next;
      render();
    }),
    stopAction = context.layer.actions.on("celebrate", render);
  render();
  return () => {
    stop();
    stopAction();
    node.remove();
  };
}
