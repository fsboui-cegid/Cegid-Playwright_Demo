class AvatarMenuPage {
  constructor(page) {
    this.page = page;
    this.avatarButton = page.locator('//button[@title="Open profile menu"]');
    this.accountName = page.locator('//div[@id="header-profile-menu"]//p[contains(text(),"Bonjour")]');
    this.logoutButton = page.locator('//ul[@role="menu"]//span[contains(text(),"Déconnexion")]');
    this.languageDropdown = page.locator('//p[contains(text(),"Mes options")]/../div[1]');
    this.allOptions = page.locator('.avatar-menu-options > li');
  }

  // Actions
  async clickAvatar() {
    await this.avatarButton.click();
  }

  // Validations
  async checkAccountNameVisible() {
    await this.accountName.waitFor({ state: 'visible' });
  }

  async checkLogoutButtonVisible() {
    await this.logoutButton.waitFor({ state: 'visible' });
  }

  async checkLanguageDropdownVisible() {
    await this.languageDropdown.waitFor({ state: 'visible' });
  }

  async checkNoOtherOptions() {
    const count = await this.allOptions.count();
    if (count !== 3) {
      throw new Error(`Expected 3 options, but found ${count}`);
    }
  }
}

module.exports = { AvatarMenuPage };
