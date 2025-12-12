import React from "react";
import { describe, expect, it } from "vitest";

import { htmlToText, renderEmailTemplate } from "@pelatform/email/helpers";

describe("Snapshot Templates", () => {
  it("should match snapshot for simple template", async () => {
    const Template = ({ name }: { name: string }) => React.createElement("div", null, `Hi ${name}`);
    const html = await renderEmailTemplate(Template, { name: "Alice" });
    const text = htmlToText(html);
    expect(text).toMatchInlineSnapshot('"Hi Alice"');
  });
});
