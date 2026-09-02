export interface BaseEmailOptions {
  title: string;
  previewText?: string;
  content: string;
}

export const renderBaseTemplate = ({ title, previewText, content }: BaseEmailOptions): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #172033;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F8FAFC;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header {
      background: linear-gradient(135deg, #0F2747 0%, #1E3A8A 100%);
      padding: 32px 40px;
      text-align: center;
    }
    .logo {
      font-size: 26px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 1.5px;
      text-decoration: none;
      display: inline-block;
    }
    .tagline {
      color: #93C5FD;
      font-size: 13px;
      margin-top: 4px;
      letter-spacing: 0.5px;
    }
    .body {
      padding: 40px;
    }
    .footer {
      background-color: #F8FAFC;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #E2E8F0;
      color: #64748B;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer a {
      color: #2563EB;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      background-color: #2563EB;
      color: #FFFFFF !important;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .otp-box {
      background-color: #EFF6FF;
      border: 2px dashed #93C5FD;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 34px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #1E3A8A;
      margin: 0;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      background-color: #EFF6FF;
      color: #1D4ED8;
      border: 1px solid #DBEAFE;
    }
    .job-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>` : ''}
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="${process.env.CLIENT_URL || 'https://workmark.com'}" class="logo">WORKMARK</a>
        <div class="tagline">Find where you belong</div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Workmark Inc. All rights reserved.</p>
        <p>Connecting exceptional talent with opportunities worldwide.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};
